import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient opacity-95" />
      <div className="absolute inset-0 bg-hero-pattern opacity-10" />
      
      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-8">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Join 50,000+ members fighting food waste</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Every meal saved is a step towards a sustainable future. Join our community today and start creating real impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="xl"
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-elevated"
              asChild
            >
              <Link to="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <p className="mt-8 text-sm text-white/60">
            Free forever for individual donors • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
