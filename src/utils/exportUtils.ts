import { format } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: any[];
}

export const exportOrdersToCSV = (orders: Order[], filename?: string) => {
  const headers = [
    "Order Number",
    "Customer Name",
    "Customer Email",
    "Date",
    "Items",
    "Total (₦)",
    "Payment Status",
    "Order Status",
  ];

  const rows = orders.map((order) => [
    order.order_number,
    order.customer_name,
    order.customer_email,
    format(new Date(order.created_at), "yyyy-MM-dd HH:mm"),
    order.items?.length || 0,
    order.total,
    order.payment_status,
    order.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    filename || `orders-${format(new Date(), "yyyy-MM-dd")}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAnalyticsToPDF = (orders: Order[]) => {
  // Calculate analytics data
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.payment_status === "completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / completedOrders.length : 0;

  const statusCounts: Record<string, number> = {};
  orders.forEach((order) => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });

  // Product analysis
  const productCounts: Record<string, { quantity: number; revenue: number }> = {};
  orders.forEach((order) => {
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        const name = item.name || item.product_name || "Unknown";
        if (!productCounts[name]) {
          productCounts[name] = { quantity: 0, revenue: 0 };
        }
        productCounts[name].quantity += item.quantity || 1;
        productCounts[name].revenue += (item.quantity || 1) * (item.price || 0);
      });
    }
  });

  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5);

  // Create printable HTML
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sales Analytics Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1a1a1a; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e5e5e5; }
        .header h1 { font-size: 28px; margin-bottom: 8px; }
        .header p { color: #666; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #1a1a1a; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; margin-top: 4px; }
        .section { margin-bottom: 30px; }
        .section h2 { font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e5e5e5; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
        th { background: #f5f5f5; font-weight: 600; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #666; font-size: 12px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Sales Analytics Report</h1>
        <p>Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${totalOrders}</div>
          <div class="stat-label">Total Orders</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">₦${totalRevenue.toLocaleString()}</div>
          <div class="stat-label">Total Revenue</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${completedOrders.length}</div>
          <div class="stat-label">Completed Orders</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">₦${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="stat-label">Avg Order Value</div>
        </div>
      </div>

      <div class="section">
        <h2>Orders by Status</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(statusCounts)
              .map(
                ([status, count]) => `
              <tr>
                <td>${status.charAt(0).toUpperCase() + status.slice(1)}</td>
                <td>${count}</td>
                <td>${((count / totalOrders) * 100).toFixed(1)}%</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Top Products</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${
              topProducts.length > 0
                ? topProducts
                    .map(
                      ([name, data]) => `
                <tr>
                  <td>${name}</td>
                  <td>${data.quantity}</td>
                  <td>₦${data.revenue.toLocaleString()}</td>
                </tr>
              `
                    )
                    .join("")
                : '<tr><td colspan="3" style="text-align: center; color: #666;">No product data available</td></tr>'
            }
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>This report was automatically generated. Data accurate as of ${format(new Date(), "MMMM d, yyyy")}.</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
