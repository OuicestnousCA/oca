import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | DTS</title>
        <meta name="description" content="Terms and conditions for using the DTS website and services." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">OUICESTNOUS Terms and Conditions Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to OUICESTNOUS. These terms and conditions outline the rules and regulations for using OUICESTNOUS's Website.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                OUICESTNOUS is located at: 147 Voortrekker Road, Bellville, 7530.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By accessing this website we assume you accept these terms and conditions in full. Do not continue to use OUICESTNOUS's website if you do not accept all of the terms and conditions stated on this page.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice, and any or all Agreements: Client, You and Your refers to the person accessing this website and accepting the Company's terms and conditions. The Company, Ourselves, We, Our, and Us, refers to our Company. Party, Parties, or Us, refers to both the Client and ourselves, or the Client or ourselves.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client most appropriately, whether by formal meetings of a fixed duration, or any other means, for the express purpose of meeting the Client's needs in respect of the provision of the Company's stated services/products, by and subject to, prevailing law of (Address).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Any use of the above terminology or other words in the singular, plural, capitalization, and/or he/she or they, are taken as interchangeable and therefore as referring to same.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We employ the use of cookies. By using OUICESTNOUS's website you consent to the use of cookies by OUICESTNOUS's privacy policy. Most of the modern day interactive websites use cookies to enable us to retrieve user details for each visit.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are used in some areas of our site to enable the functionality of this area and ease of use for those people visiting. Some of our affiliate/advertising partners may also use cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">License</h2>
              <p className="text-muted-foreground leading-relaxed">
                Unless otherwise stated, OUICESTNOUS and/or its licensors own the intellectual property rights for all material on OUICESTNOUS.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                All intellectual property rights are reserved. You may view and/or print pages from www.ouicestnous.com for your personal use subject to restrictions set in these terms and conditions.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-2">You must not:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Republish material from www.ouicestnous.com.</li>
                <li>Sell, rent or sub-license material from www.ouicestnous.com.</li>
                <li>Reproduce, duplicate or copy material from www.ouicestnous.com.</li>
                <li>Redistribute content from OUICESTNOUS (unless content is specifically made for redistribution).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose, and/or the use of reasonable care and skill).
              </p>
              <p className="text-muted-foreground leading-relaxed mb-2">Nothing in this disclaimer will:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Limit or exclude our or your liability for death or personal injury resulting from negligence.</li>
                <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation.</li>
                <li>Limit any of our or your liabilities in any way that is not permitted under applicable law.</li>
                <li>Or exclude any of our or your liabilities that may not be excluded under applicable law.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4 mb-2">The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>are subject to the preceding paragraph; and</li>
                <li>govern all liabilities arising under the disclaimer or about the subject matter of this disclaimer, including liabilities that arise in contract, tort (including negligence), and for breach of statutory duty.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To the extent that the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
