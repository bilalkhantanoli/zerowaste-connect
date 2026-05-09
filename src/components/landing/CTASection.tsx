import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background */}
      <div className="bg-hero-gradient absolute inset-0 opacity-95" />
      <div className="absolute inset-0 bg-hero-pattern opacity-10" />

      {/* Floating elements */}
      <div className="animate-float absolute left-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="animate-float-delayed absolute bottom-10 right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Join 50,000+ members fighting food waste
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Ready to Make a Difference?
          </h2>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl">
            Every meal saved is a step towards a sustainable future. Join our community today and
            start creating real impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="xl"
              className="shadow-elevated bg-white font-semibold text-primary hover:bg-white/90"
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
              className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link to="/contact">Contact Sales</Link>
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
