import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="hero-section">
      <img 
        src={heroImage} 
        alt="Streetwear fashion - person silhouette against horizon"
        className="absolute inset-0 w-full h-full object-cover grayscale"
      />
      <div className="hero-overlay" />
      <div className="relative z-10 container text-center">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-foreground animate-fade-up">
          OUI C'EST NOUS
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Streetwear from the heart
        </p>
        <div className="mt-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <a href="#products" className="btn-primary">
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
