import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, AlertTriangle, Package, RefreshCw, Save } from "lucide-react";

interface InventoryItem {
  id: string;
  product_id: number;
  product_name: string;
  stock_quantity: number;
  low_stock_threshold: number;
  updated_at: string;
}

const InventoryManagement = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<Record<string, { quantity: number; threshold: number }>>({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("product_name");

    if (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to load inventory");
    } else {
      setInventory(data || []);
    }
    setLoading(false);
  };

  const initializeInventory = async () => {
    setLoading(true);
    
    // Get existing inventory product IDs
    const { data: existing } = await supabase
      .from("inventory")
      .select("product_id");
    
    const existingIds = new Set((existing || []).map(item => item.product_id));
    
    // Filter products that don't have inventory yet
    const missingProducts = products.filter(p => !existingIds.has(p.id));
    
    if (missingProducts.length === 0) {
      toast.info("All products already have inventory records");
      setLoading(false);
      return;
    }

    const inventoryItems = missingProducts.map(product => ({
      product_id: product.id,
      product_name: product.name,
      stock_quantity: 50, // Default starting stock
      low_stock_threshold: 10,
    }));

    const { error } = await supabase
      .from("inventory")
      .insert(inventoryItems);

    if (error) {
      console.error("Error initializing inventory:", error);
      toast.error("Failed to initialize inventory");
    } else {
      toast.success(`Initialized inventory for ${missingProducts.length} products`);
      fetchInventory();
    }
    setLoading(false);
  };

  const handleQuantityChange = (id: string, value: string, current: InventoryItem) => {
    const quantity = parseInt(value) || 0;
    setEditedItems(prev => ({
      ...prev,
      [id]: {
        quantity,
        threshold: prev[id]?.threshold ?? current.low_stock_threshold,
      },
    }));
  };

  const handleThresholdChange = (id: string, value: string, current: InventoryItem) => {
    const threshold = parseInt(value) || 0;
    setEditedItems(prev => ({
      ...prev,
      [id]: {
        quantity: prev[id]?.quantity ?? current.stock_quantity,
        threshold,
      },
    }));
  };

  const saveItem = async (item: InventoryItem) => {
    const edited = editedItems[item.id];
    if (!edited) return;

    setSaving(item.id);
    const { error } = await supabase
      .from("inventory")
      .update({
        stock_quantity: edited.quantity,
        low_stock_threshold: edited.threshold,
      })
      .eq("id", item.id);

    if (error) {
      console.error("Error updating inventory:", error);
      toast.error("Failed to update inventory");
    } else {
      toast.success(`Updated ${item.product_name}`);
      setEditedItems(prev => {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      });
      fetchInventory();
    }
    setSaving(null);
  };

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" };
    }
    if (quantity <= threshold) {
      return { label: "Low Stock", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" };
    }
    return { label: "In Stock", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" };
  };

  const lowStockCount = inventory.filter(item => item.stock_quantity <= item.low_stock_threshold && item.stock_quantity > 0).length;
  const outOfStockCount = inventory.filter(item => item.stock_quantity === 0).length;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stock Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {outOfStockCount > 0 && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {outOfStockCount}
                  </Badge>
                  <span>products out of stock</span>
                </div>
              )}
              {lowStockCount > 0 && (
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {lowStockCount}
                  </Badge>
                  <span>products with low stock</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Inventory
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchInventory}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {inventory.length < products.length && (
              <Button size="sm" onClick={initializeInventory}>
                Initialize Missing Products
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No inventory records found</p>
              <Button onClick={initializeInventory}>
                Initialize Inventory for All Products
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Stock Quantity</TableHead>
                    <TableHead className="text-center">Low Stock Threshold</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const edited = editedItems[item.id];
                    const currentQuantity = edited?.quantity ?? item.stock_quantity;
                    const currentThreshold = edited?.threshold ?? item.low_stock_threshold;
                    const status = getStockStatus(currentQuantity, currentThreshold);
                    const hasChanges = edited !== undefined;

                    return (
                      <TableRow key={item.id} className={item.stock_quantity <= item.low_stock_threshold ? "bg-yellow-50/50 dark:bg-yellow-950/20" : ""}>
                        <TableCell className="font-medium">{item.product_name}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="0"
                            value={currentQuantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value, item)}
                            className="w-24 mx-auto text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="0"
                            value={currentThreshold}
                            onChange={(e) => handleThresholdChange(item.id, e.target.value, item)}
                            className="w-24 mx-auto text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={status.className}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => saveItem(item)}
                            disabled={!hasChanges || saving === item.id}
                          >
                            {saving === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
