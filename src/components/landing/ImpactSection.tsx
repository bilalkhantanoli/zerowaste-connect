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
    <section id="impact" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 block">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Every Meal Counts,
            <span className="text-gradient"> Every Action Matters</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Together, we're creating a sustainable food system that benefits communities and the planet.
          </p>
        </div>

        {/* Impact Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {impactMetrics.map((metric) => (
            <Card key={metric.label} variant="elevated" className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-success text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    {metric.trend}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm font-medium text-foreground mb-2">{metric.label}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement.title} className="bg-card-gradient border-primary/10">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
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
