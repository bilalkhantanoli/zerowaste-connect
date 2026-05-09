import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Building2, Users, Bike, ShieldCheck } from 'lucide-react';

const roles = [
  {
    title: 'For Donors',
    description: 'Restaurants, grocery stores, farms, and individuals with surplus food.',
    icon: Building2,
    features: [
      'Easy food listing with photos',
      'Track donation impact',
      'Tax deduction receipts',
      'Scheduled pickups',
    ],
    cta: 'Start Donating',
    href: '/register?role=donor',
    color: 'bg-primary/10 text-primary border-primary/20',
    iconBg: 'bg-primary/10',
  },
  {
    title: 'For Recipients',
    description: 'Charities, food banks, shelters, and community organizations.',
    icon: Users,
    features: [
      'Browse available food',
      'Request specific items',
      'Real-time delivery tracking',
      'Dietary preference filters',
    ],
    cta: 'Request Food',
    href: '/register?role=recipient',
    color: 'bg-accent/10 text-accent-foreground border-accent/20',
    iconBg: 'bg-accent/10',
  },
  {
    title: 'For Volunteers',
    description: 'Make a difference by delivering food to those who need it most.',
    icon: Bike,
    features: [
      'Flexible schedule',
      'Optimized delivery routes',
      'Impact tracking dashboard',
      'Community recognition',
    ],
    cta: 'Become a Volunteer',
    href: '/register?role=volunteer',
    color: 'bg-success/10 text-success border-success/20',
    iconBg: 'bg-success/10',
  },
  {
    title: 'For Organizations',
    description: 'Partner with us to scale food redistribution in your region.',
    icon: ShieldCheck,
    features: [
      'Custom integrations',
      'Analytics dashboard',
      'Multi-location support',
      'Dedicated support',
    ],
    cta: 'Partner With Us',
    href: '/contact',
    color: 'bg-muted text-muted-foreground border-border',
    iconBg: 'bg-muted',
  },
];

export function RolesSection() {
  return (
    <section className="bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-wider text-primary">
            Join The Movement
          </span>
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            Everyone Has a Role in
            <span className="text-gradient"> Fighting Food Waste</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you have food to share, need assistance, or want to volunteer, there's a place
            for you.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {roles.map((role) => (
            <Card
              key={role.title}
              variant="interactive"
              className={`border-2 ${role.color.split(' ')[2]} hover:border-primary/40`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-3 ${role.iconBg}`}>
                    <role.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="mb-2 text-xl">{role.title}</CardTitle>
                    <CardDescription className="text-sm">{role.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-3">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="group w-full" asChild>
                  <Link to={role.href}>
                    {role.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
