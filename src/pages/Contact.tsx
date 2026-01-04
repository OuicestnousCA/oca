import { Helmet } from "react-helmet-async";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent successfully! We'll get back to you soon.");
    form.reset();
    setIsSubmitting(false);
  };

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
        <main className="flex-1">
          {/* Title */}
          <div className="py-8 md:py-12">
            <h1 className="font-display text-4xl md:text-5xl tracking-wider text-center animate-fade-up">
              Contact
            </h1>
          </div>

          {/* Map Section */}
          <div className="w-full h-[300px] md:h-[400px] bg-muted mb-12 animate-fade-up stagger-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.6374!2d28.0473!3d-26.1076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA2JzI3LjQiUyAyOMKwMDInNTAuMyJF!5e0!3m2!1sen!2sza!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="OUICESTNOUS Location"
              className="grayscale"
            />
          </div>

          {/* Contact Content */}
          <div className="container max-w-6xl pb-16 md:pb-24">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              {/* Left Column - Stay In Touch */}
              <div className="space-y-8 opacity-0 animate-fade-up stagger-2">
                <div>
                  <h2 className="font-display text-2xl tracking-wide mb-3">Stay In Touch</h2>
                  <p className="text-muted-foreground text-sm">
                    Join us and stay tuned and alert with the latest news, drops, discounts, and updates.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-lg tracking-wide">Customer Service</h3>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href="mailto:info@ouicestnous.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      info@ouicestnous.com
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href="tel:+27218275024" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      +27 (0) 81 275 0024
                    </a>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p>Mon–Fri: 09:00 AM – 5:00 PM</p>
                      <p>Sat – 09:00 AM – 2:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-lg tracking-wide uppercase">Social Media</h3>
                  <a 
                    href="https://instagram.com/ouicestnous" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 border border-border hover:bg-accent transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="opacity-0 animate-fade-up stagger-3">
                <h2 className="font-display text-2xl tracking-wide mb-6">Got Any Questions?</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-background border-border rounded-none focus:ring-1 focus:ring-foreground"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Email *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              className="bg-background border-border rounded-none focus:ring-1 focus:ring-foreground"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Comment or Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={5}
                              className="bg-background border-border rounded-none focus:ring-1 focus:ring-foreground resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-8 py-2 rounded-none border border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      {isSubmitting ? "Sending..." : "SUBMIT"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <ThemeToggle />
      </div>
    </>
  );
};

export default Contact;
