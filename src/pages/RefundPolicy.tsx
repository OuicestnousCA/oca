import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund and Returns Policy | DTS</title>
        <meta name="description" content="Refund and Returns Policy for DTS - Learn about our return process, refunds, and exchange policies." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background pt-32 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Refund and Returns Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Overview</h2>
              <p className="text-muted-foreground mb-4">
                To be eligible for a return, your item must be unused and in the same condition you received it. It must also be in the original packaging.
              </p>
              <p className="text-muted-foreground mb-4">
                Several types of goods are exempt from being returned. Perishable goods such as food, flowers, newspapers or magazines cannot be returned. We also do not accept products that are intimate or sanitary goods, hazardous materials, or flammable liquids or gases.
              </p>
              <p className="text-muted-foreground">
                To complete your return, we require a receipt or proof of purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Late or missing refunds</h2>
              <p className="text-muted-foreground mb-4">
                If you haven't received a refund yet, first recheck your bank account.
              </p>
              <p className="text-muted-foreground mb-4">
                Then contact your credit card company, it may take some time before your refund is officially posted.
              </p>
              <p className="text-muted-foreground mb-4">
                Next, contact your bank. There is often some processing time before a refund is posted.
              </p>
              <p className="text-muted-foreground">
                If you've done all of this and still have not received your refund, please contact us at{" "}
                <a href="mailto:info@ouicestnous.com" className="text-primary hover:underline">info@ouicestnous.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Sale items</h2>
              <p className="text-muted-foreground mb-4">
                Only regular-priced items may be refunded. Sale items cannot be refunded.
              </p>
              <p className="text-muted-foreground mb-4">
                We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at{" "}
                <a href="mailto:info@ouicestnous.com" className="text-primary hover:underline">info@ouicestnous.com</a>{" "}
                and send your item to 147 Voortrekker Road, Bellville, 7530.
              </p>
              <p className="text-muted-foreground mb-4">
                If the item was marked as a gift when purchased and shipped directly to you, you'll receive a gift credit for the value of your return. Once the returned item is received, a gift certificate will be mailed to you.
              </p>
              <p className="text-muted-foreground mb-4">
                If the item wasn't marked as a gift when purchased, or the gift giver had the order shipped to themselves to give to you later, we will send a refund to the gift giver and they will find out about your return.
              </p>
              <p className="text-muted-foreground mb-4">
                To return your product, you should mail your product to 147 Voortrekker Road, Bellville, 7530.
              </p>
              <p className="text-muted-foreground mb-4">
                You will be responsible for paying for your shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
              </p>
              <p className="text-muted-foreground mb-4">
                Depending on where you live, the time it may take for your exchanged product to reach you may vary.
              </p>
              <p className="text-muted-foreground mb-4">
                If you are returning more expensive items, you may consider using a trackable shipping service or purchasing shipping insurance. We don't guarantee that we will receive your returned item.
              </p>
              <p className="text-muted-foreground">
                Contact us at{" "}
                <a href="mailto:info@ouicestnous.com" className="text-primary hover:underline">info@ouicestnous.com</a>{" "}
                for questions related to refunds and returns.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RefundPolicy;
