import { Gift, Search, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: '01',
    title: 'Donate Food',
    description: 'Restaurants, stores, and individuals list surplus food with photos, quantity, and expiry details.',
    icon: Gift,
    color: 'bg-primary/10 text-primary',
  },
  {
    number: '02',
    title: 'Smart Matching',
    description: 'Our AI matches donations with nearby recipients based on location, urgency, and food type.',
    icon: Search,
    color: 'bg-accent/10 text-accent-foreground',
  },
  {
    number: '03',
    title: 'Volunteer Delivery',
    description: 'Local volunteers pick up and deliver food using optimized routes for maximum efficiency.',
    icon: Truck,
    color: 'bg-success/10 text-success',
  },
  {
    number: '04',
    title: 'Impact Confirmed',
    description: 'Recipients confirm delivery, and everyone sees the real impact they\'ve made together.',
    icon: CheckCircle,
    color: 'bg-urgent/10 text-urgent',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Four Simple Steps to
            <span className="text-gradient"> Zero Waste</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform makes food redistribution effortless, connecting surplus with need in real-time.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card variant="interactive" className="h-full">
                <CardContent className="p-6">
                  {/* Step Number */}
                  <span className="text-6xl font-bold text-muted/30 absolute top-4 right-4">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                    <step.icon className="h-7 w-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Connector Arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
