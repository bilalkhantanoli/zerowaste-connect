import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LayoutDashboard,
  Truck,
  Clock,
  Award,
  MapPin,
  Navigation,
  Phone,
  CheckCircle,
  ArrowRight,
  Star,
  Route,
  Timer,
  AlertTriangle,
} from 'lucide-react';
import { fetchVolunteerDeliveries } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/volunteer', icon: LayoutDashboard },
  { label: 'My Deliveries', href: '/volunteer/deliveries', icon: Truck },
  { label: 'History', href: '/volunteer/history', icon: Clock },
  { label: 'Achievements', href: '/volunteer/achievements', icon: Award },
];

const activeStatusConfig = {
  assigned: {
    label: 'Ready for Pickup',
    color: 'bg-accent/10 text-accent-foreground',
    next: 'Start Pickup',
    progress: 0,
  },
  picking_up: {
    label: 'En Route to Pickup',
    color: 'bg-primary/10 text-primary',
    next: 'Confirm Pickup',
    progress: 33,
  },
  in_transit: {
    label: 'In Transit',
    color: 'bg-success/10 text-success',
    next: 'Confirm Delivery',
    progress: 66,
  },
} as const;

const historyStatusConfig = {
  delivered: { label: 'Delivered', variant: 'success' as const },
  failed: { label: 'Failed', variant: 'destructive' as const },
} as const;

export default function VolunteerDashboard() {
  const location = useLocation();
  const { user } = useAuth();
  const { data: deliveries = [] } = useQuery({
    queryKey: ['volunteer-deliveries', user?.id],
    queryFn: () => fetchVolunteerDeliveries(user!.id),
    enabled: !!user?.id,
  });

  const activeDeliveries = deliveries.filter((delivery) =>
    ['assigned', 'picking_up', 'in_transit'].includes(delivery.status),
  );
  const historyDeliveries = deliveries.filter((delivery) =>
    ['delivered', 'failed'].includes(delivery.status),
  );

  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const selected =
    activeDeliveries.find((d) => d.id === selectedDelivery) ?? activeDeliveries[0] ?? null;

  const completedDeliveries = historyDeliveries.filter((delivery) => delivery.status === 'delivered');
  const failedDeliveries = historyDeliveries.filter((delivery) => delivery.status === 'failed');
  const deliveredMeals = completedDeliveries.reduce(
    (sum, delivery) => sum + (delivery.donation?.quantity ?? 0),
    0,
  );
  const totalDistance = deliveries.reduce((sum, delivery) => sum + (delivery.distance_km ?? 0), 0);
  const averageDeliveryTime = Math.round(
    deliveries.reduce((sum, delivery) => sum + (delivery.estimated_minutes ?? 0), 0) /
      Math.max(deliveries.length, 1),
  );

  const pageConfig = {
    '/volunteer': {
      title: 'Volunteer Dashboard',
      heading: `Ready to make a difference, ${user?.name ?? 'Volunteer'}!`,
      description: (
        <>
          You have{' '}
          <span className="font-semibold text-primary">{activeDeliveries.length} active deliveries</span>{' '}
          waiting for you.
        </>
      ),
    },
    '/volunteer/deliveries': {
      title: 'My Deliveries',
      heading: 'My Deliveries',
      description: 'View and manage your assigned food pickups and drop-offs.',
    },
    '/volunteer/history': {
      title: 'Delivery History',
      heading: 'History',
      description: 'Review your completed and failed deliveries.',
    },
    '/volunteer/achievements': {
      title: 'Achievements',
      heading: 'Achievements',
      description: 'Track your delivery impact and volunteer milestones.',
    },
  } as const;

  const currentPage =
    pageConfig[location.pathname as keyof typeof pageConfig] ?? pageConfig['/volunteer'];

  const renderActiveDeliveriesPanel = () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
          <CardDescription>Your assigned food pickups and deliveries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeDeliveries.map((delivery) => {
            const status = activeStatusConfig[delivery.status as keyof typeof activeStatusConfig];
            const isSelected = (selectedDelivery ?? selected?.id) === delivery.id;
            return (
              <button
                key={delivery.id}
                onClick={() => setSelectedDelivery(delivery.id)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30'}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{delivery.donation?.title ?? 'Donation'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {delivery.donation?.quantity ?? 0} {delivery.donation?.unit ?? 'items'}
                    </p>
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {delivery.distance_km ?? 0} km
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Timer className="h-4 w-4" />~{delivery.estimated_minutes ?? 0} min
                  </div>
                </div>
              </button>
            );
          })}
          {activeDeliveries.length === 0 && (
            <div className="rounded-xl bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              No active deliveries assigned yet.
            </div>
          )}
        </CardContent>
      </Card>
      {selected && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
            <CardDescription>Route and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Delivery Progress</span>
                <span className="text-muted-foreground">
                  {activeStatusConfig[selected.status as keyof typeof activeStatusConfig].progress}%
                </span>
              </div>
              <Progress
                value={activeStatusConfig[selected.status as keyof typeof activeStatusConfig].progress}
                className="h-2"
              />
            </div>
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                Pickup
              </p>
              <h4 className="font-medium">{selected.donation?.donor?.name ?? 'Donor'}</h4>
              <p className="text-sm text-muted-foreground">{selected.donation?.address ?? '-'}</p>
              <Button variant="ghost" size="sm" className="-ml-2 mt-2">
                <Phone className="mr-2 h-4 w-4" />
                {selected.donation?.donor?.phone ?? 'N/A'}
              </Button>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground" />
            </div>
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                Dropoff
              </p>
              <h4 className="font-medium">{selected.recipient?.name ?? 'Recipient'}</h4>
              <p className="text-sm text-muted-foreground">{selected.recipient?.address ?? '-'}</p>
              <Button variant="ghost" size="sm" className="-ml-2 mt-2">
                <Phone className="mr-2 h-4 w-4" />
                {selected.recipient?.phone ?? 'N/A'}
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </Button>
              <Button variant="hero" className="flex-1">
                {activeStatusConfig[selected.status as keyof typeof activeStatusConfig].next}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Completed"
          value={completedDeliveries.length}
          description="Successful deliveries"
          icon={CheckCircle}
          color="success"
        />
        <StatsCard
          title="Failed"
          value={failedDeliveries.length}
          description="Need follow-up"
          icon={AlertTriangle}
          color="urgent"
        />
        <StatsCard
          title="Distance Covered"
          value={`${historyDeliveries.reduce((sum, d) => sum + (d.distance_km ?? 0), 0).toFixed(1)} km`}
          description="History only"
          icon={Route}
          color="primary"
        />
        <StatsCard
          title="Avg Time"
          value={`${Math.round(historyDeliveries.reduce((sum, d) => sum + (d.estimated_minutes ?? 0), 0) / Math.max(historyDeliveries.length, 1))} min`}
          description="Past deliveries"
          icon={Timer}
          color="accent"
        />
      </div>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
          <CardDescription>Your completed and failed deliveries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {historyDeliveries.map((delivery) => {
            const status = historyStatusConfig[delivery.status as keyof typeof historyStatusConfig];
            return (
              <div key={delivery.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-medium">{delivery.donation?.title ?? 'Delivery'}</h4>
                    <p className="text-sm text-muted-foreground">
                      Recipient: {delivery.recipient?.name ?? 'Unknown recipient'}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <span className="flex items-center gap-1">
                    <PackageIcon />
                    {delivery.donation?.quantity ?? 0} {delivery.donation?.unit ?? 'items'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon />
                    {new Date(delivery.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {delivery.distance_km ?? 0} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {delivery.estimated_minutes ? `~${delivery.estimated_minutes} min` : 'No ETA'}
                  </span>
                </div>
              </div>
            );
          })}
          {historyDeliveries.length === 0 && (
            <div className="rounded-xl bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              No delivery history yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAchievements = () => {
    const badges = [
      {
        title: 'First Delivery',
        description: 'Complete your first successful drop-off.',
        unlocked: completedDeliveries.length >= 1,
      },
      {
        title: 'Reliable Runner',
        description: 'Complete 5 successful deliveries.',
        unlocked: completedDeliveries.length >= 5,
      },
      {
        title: 'Community Carrier',
        description: 'Deliver 25 total meal units.',
        unlocked: deliveredMeals >= 25,
      },
      {
        title: 'Road Warrior',
        description: 'Travel 50 km across all deliveries.',
        unlocked: totalDistance >= 50,
      },
    ];

    return (
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Deliveries Completed"
            value={completedDeliveries.length}
            description="All time"
            icon={CheckCircle}
            color="success"
          />
          <StatsCard
            title="Meals Delivered"
            value={deliveredMeals}
            description="Completed runs"
            icon={Star}
            color="accent"
          />
          <StatsCard
            title="Distance Covered"
            value={`${totalDistance.toFixed(1)} km`}
            description="All assignments"
            icon={Route}
            color="primary"
          />
          <StatsCard
            title="Avg Delivery Time"
            value={`${averageDeliveryTime} min`}
            description="Estimated"
            icon={Timer}
            color="urgent"
          />
        </div>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Achievement Progress</CardTitle>
            <CardDescription>Your current volunteer milestones</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {badges.map((badge) => (
              <div
                key={badge.title}
                className={`rounded-xl border p-4 ${badge.unlocked ? 'border-success bg-success/10' : 'border-border bg-muted/30'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-medium">{badge.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
                  </div>
                  <Badge variant={badge.unlocked ? 'success' : 'secondary'}>
                    {badge.unlocked ? 'Unlocked' : 'Locked'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOverview = () => (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Deliveries Completed"
          value={completedDeliveries.length}
          description="All time"
          icon={CheckCircle}
          color="success"
        />
        <StatsCard
          title="Meals Delivered"
          value={deliveredMeals}
          description="Completed runs"
          icon={Star}
          color="accent"
        />
        <StatsCard
          title="Distance Covered"
          value={`${totalDistance.toFixed(1)} km`}
          description="All assignments"
          icon={Route}
          color="primary"
        />
        <StatsCard
          title="Avg Delivery Time"
          value={`${averageDeliveryTime} min`}
          description="Estimated"
          icon={Timer}
          color="urgent"
        />
      </div>
      {renderActiveDeliveriesPanel()}
    </>
  );

  const renderContent = () => {
    switch (location.pathname) {
      case '/volunteer/deliveries':
        return renderActiveDeliveriesPanel();
      case '/volunteer/history':
        return renderHistory();
      case '/volunteer/achievements':
        return renderAchievements();
      case '/volunteer':
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout navItems={navItems} title={currentPage.title}>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">{currentPage.heading}</h2>
        <p className="text-muted-foreground">{currentPage.description}</p>
      </div>
      {renderContent()}
    </DashboardLayout>
  );
}

function PackageIcon() {
  return <Truck className="h-3 w-3" />;
}

function CalendarIcon() {
  return <Clock className="h-3 w-3" />;
}
