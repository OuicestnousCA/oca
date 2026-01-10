import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ShippingPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Shipping Policy | DTS</title>
        <meta name="description" content="Shipping information and delivery details for DTS orders." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Shipping Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Processing Time</h2>
              <p className="text-muted-foreground leading-relaxed">
                All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Shipping Rates & Delivery Estimates</h2>
              <p className="text-muted-foreground leading-relaxed">
                Shipping charges for your order will be calculated and displayed at checkout.
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-4 py-2 text-left text-foreground">Shipping Method</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Estimated Delivery</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Standard Shipping</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">5-7 business days</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">R99</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Express Shipping</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">2-3 business days</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">R149</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Free Shipping</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">5-7 business days</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Orders over R1000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Shipment Confirmation & Order Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Customs, Duties and Taxes</h2>
              <p className="text-muted-foreground leading-relaxed">
                OUICESTNOUS is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Damages</h2>
              <p className="text-muted-foreground leading-relaxed">
                OUICESTNOUS is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Please save all packaging materials and damaged goods before filing a claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Missing or Stolen Packages</h2>
              <p className="text-muted-foreground leading-relaxed">
                OUICESTNOUS is not responsible for missing or stolen packages. If your tracking information states that your package was delivered but you have not received it, please contact us and we will work with the shipping carrier to locate your package.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our shipping policy, please contact us at:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>Email: support@ouicestnous.com</li>
                <li>Address: 147 Voortrekker Road, Bellville, 7530</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShippingPolicy;
