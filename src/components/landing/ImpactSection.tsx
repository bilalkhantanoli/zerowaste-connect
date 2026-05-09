import { TrendingUp, Leaf, Users, Heart, Globe, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const impactMetrics = [
  {
    icon: Heart,
    value: '2.5M+',
    label: 'Meals Provided',
    description: 'Nutritious meals delivered to families in need',
    trend: '+23% this month',
    color: 'text-urgent',
    bgColor: 'bg-urgent/10',
  },
  {
    icon: Leaf,
    value: '1.2M kg',
    label: 'Food Saved',
    description: 'Perfectly good food rescued from waste',
    trend: '+18% this month',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Globe,
    value: '850K kg',
    label: 'CO₂ Prevented',
    description: 'Carbon emissions avoided through redistribution',
    trend: '+15% this month',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Users,
    value: '15,000+',
    label: 'Active Volunteers',
    description: 'Community members making deliveries daily',
    trend: '+12% this month',
    color: 'text-accent-foreground',
    bgColor: 'bg-accent/10',
  },
];

const achievements = [
  { icon: Award, title: 'UN SDG Partner', description: 'Supporting Zero Hunger goal' },
  { icon: Globe, title: '50+ Cities', description: 'Across 12 countries' },
  { icon: Heart, title: 'B Corp Certified', description: 'Meeting highest standards' },
];

export function ImpactSection() {
  return (
    <section id="impact" className="bg-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-wider text-primary">
            Our Impact
          </span>
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            Every Meal Counts,
            <span className="text-gradient"> Every Action Matters</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Together, we're creating a sustainable food system that benefits communities and the
            planet.
          </p>
        </div>

        {/* Impact Metrics Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {impactMetrics.map((metric) => (
            <Card key={metric.label} variant="elevated" className="overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-success">
                    <TrendingUp className="h-4 w-4" />
                    {metric.trend}
                  </div>
                </div>
                <div className="mb-1 text-3xl font-bold">{metric.value}</div>
                <div className="mb-2 text-sm font-medium text-foreground">{metric.label}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <div className="grid gap-6 md:grid-cols-3">
          {achievements.map((achievement) => (
            <Card key={achievement.title} className="bg-card-gradient border-primary/10">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-xl bg-primary/10 p-3">
                  <achievement.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{achievement.title}</div>
                  <div className="text-sm text-muted-foreground">{achievement.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
