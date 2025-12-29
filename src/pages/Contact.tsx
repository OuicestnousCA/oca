import { Helmet } from "react-helmet-async";
import { Mail, MapPin, Phone } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | OUICESTNOUS</title>
        <meta 
          name="description" 
          content="Get in touch with OUICESTNOUS. We're here to help with orders, returns, and any questions about our streetwear collection." 
        />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 py-16 md:py-24">
          <div className="container max-w-4xl">
            <h1 className="font-display text-4xl md:text-5xl tracking-wider text-center mb-4 animate-fade-up">
              Contact Us
            </h1>
            <p className="text-center text-muted-foreground mb-12 animate-fade-up stagger-1">
              Have a question? We'd love to hear from you.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8 opacity-0 animate-fade-up stagger-2">
                <div className="flex gap-4">
                  <div className="w-12 h-12 border border-border flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg tracking-wide">Email</h3>
                    <a href="mailto:hello@ouicestnous.com" className="text-muted-foreground hover:text-foreground transition-colors">
                      hello@ouicestnous.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 border border-border flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg tracking-wide">Phone</h3>
                    <a href="tel:+27123456789" className="text-muted-foreground hover:text-foreground transition-colors">
                      +27 12 345 6789
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 border border-border flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg tracking-wide">Location</h3>
                    <p className="text-muted-foreground">
                      Johannesburg, South Africa
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form className="space-y-6 opacity-0 animate-fade-up stagger-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea 
                    id="message"
                    rows={5}
                    className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
