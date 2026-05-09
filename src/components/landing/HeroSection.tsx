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
    <section className="bg-nature-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />

      {/* Floating Elements */}
      <div className="animate-float absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="animate-float-delayed absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative mx-auto px-4 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Join 50,000+ community members</span>
          </div>

          {/* Headline */}
          <h1
            className="animate-slide-up mb-6 text-4xl font-bold md:text-6xl lg:text-7xl"
            style={{ animationDelay: '0.1s' }}
          >
            Turn Surplus Into
            <span className="text-gradient mt-2 block">Zero Waste</span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-slide-up mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
            style={{ animationDelay: '0.2s' }}
          >
            Connect donors with those in need through smart food redistribution. Reduce waste, fight
            hunger, and build sustainable communities together.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-slide-up mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: '0.3s' }}
          >
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
          <div
            className="animate-slide-up grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8"
            style={{ animationDelay: '0.4s' }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="shadow-soft group rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-card md:p-6"
              >
                <div className="mb-2 flex items-center justify-center">
                  <div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mb-1 text-2xl font-bold text-foreground md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
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
