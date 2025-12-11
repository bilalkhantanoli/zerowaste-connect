import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Users, Truck, HeartHandshake } from 'lucide-react';

const stats = [
  { value: '2.5M+', label: 'Meals Saved', icon: HeartHandshake },
  { value: '850K', label: 'kg CO₂ Reduced', icon: Sparkles },
  { value: '15K+', label: 'Active Volunteers', icon: Users },
  { value: '98%', label: 'Delivery Success', icon: Truck },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-nature-gradient">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="container mx-auto px-4 py-20 lg:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Join 50,000+ community members</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Turn Surplus Into
            <span className="block text-gradient mt-2">Zero Waste</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Connect donors with those in need through smart food redistribution. 
            Reduce waste, fight hunger, and build sustainable communities together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Start Donating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/#how-it-works" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 md:p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 group"
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
