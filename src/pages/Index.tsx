import { Helmet } from "react-helmet-async";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>OUICESTNOUS | Authentic South African Streetwear</title>
        <meta 
          name="description" 
          content="Discover authentic South African streetwear at OUICESTNOUS. Shop hoodies, tees, jerseys, and accessories. Express yourself through fashion." 
        />
        <meta name="keywords" content="streetwear, South African fashion, hoodies, tees, urban clothing" />
        <link rel="canonical" href="https://ouicestnous.com" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">
          <Hero />
          <ProductGrid />
        </main>
        <Footer />
        <ThemeToggle />
      </div>
    </>
  );
};

export default Index;
