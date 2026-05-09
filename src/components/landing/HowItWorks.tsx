import { Gift, Search, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: '01',
    title: 'Donate Food',
    description:
      'Restaurants, stores, and individuals list surplus food with photos, quantity, and expiry details.',
    icon: Gift,
    color: 'bg-primary/10 text-primary',
  },
  {
    number: '02',
    title: 'Smart Matching',
    description:
      'Our AI matches donations with nearby recipients based on location, urgency, and food type.',
    icon: Search,
    color: 'bg-accent/10 text-accent-foreground',
  },
  {
    number: '03',
    title: 'Volunteer Delivery',
    description:
      'Local volunteers pick up and deliver food using optimized routes for maximum efficiency.',
    icon: Truck,
    color: 'bg-success/10 text-success',
  },
  {
    number: '04',
    title: 'Impact Confirmed',
    description:
      "Recipients confirm delivery, and everyone sees the real impact they've made together.",
    icon: CheckCircle,
    color: 'bg-urgent/10 text-urgent',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </span>
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            Four Simple Steps to
            <span className="text-gradient"> Zero Waste</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform makes food redistribution effortless, connecting surplus with need in
            real-time.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card variant="interactive" className="h-full">
                <CardContent className="p-6">
                  {/* Step Number */}
                  <span className="absolute right-4 top-4 text-6xl font-bold text-muted/30">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div
                    className={`h-14 w-14 rounded-2xl ${step.color} mb-6 flex items-center justify-center`}
                  >
                    <step.icon className="h-7 w-7" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Connector Arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 transform lg:flex">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
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
