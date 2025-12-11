import { useState } from 'react';
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
  Camera,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/volunteer', icon: LayoutDashboard },
  { label: 'My Deliveries', href: '/volunteer/deliveries', icon: Truck, badge: '2' },
  { label: 'History', href: '/volunteer/history', icon: Clock },
  { label: 'Achievements', href: '/volunteer/achievements', icon: Award },
];

// Mock active deliveries
const activeDeliveries = [
  {
    id: '1',
    status: 'picking_up',
    donation: {
      title: 'Fresh Bread & Pastries',
      quantity: 30,
      unit: 'items',
      category: '🍞',
    },
    pickup: {
      name: 'City Bakery',
      address: '456 Baker Lane, New York',
      phone: '+1 555-123-4567',
    },
    dropoff: {
      name: 'Hope Community Center',
      address: '789 Hope Ave, New York',
      phone: '+1 555-987-6543',
    },
    estimatedTime: 25,
    distance: 3.2,
  },
  {
    id: '2',
    status: 'assigned',
    donation: {
      title: 'Hot Prepared Meals',
      quantity: 45,
      unit: 'meals',
      category: '🍱',
    },
    pickup: {
      name: 'Corporate Caterers',
      address: '321 Corporate Blvd, New York',
      phone: '+1 555-246-8135',
    },
    dropoff: {
      name: 'Family Shelter NYC',
      address: '555 Support St, New York',
      phone: '+1 555-369-2580',
    },
    estimatedTime: 35,
    distance: 5.1,
  },
];

const statusConfig = {
  assigned: { label: 'Ready for Pickup', color: 'bg-accent/10 text-accent-foreground', next: 'Start Pickup' },
  picking_up: { label: 'En Route to Pickup', color: 'bg-primary/10 text-primary', next: 'Confirm Pickup' },
  in_transit: { label: 'In Transit', color: 'bg-success/10 text-success', next: 'Confirm Delivery' },
};

export default function VolunteerDashboard() {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(activeDeliveries[0]?.id);

  return (
    <DashboardLayout navItems={navItems} title="Volunteer Dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Ready to make a difference, Alex! 🚴</h2>
        <p className="text-muted-foreground">
          You have <span className="text-primary font-semibold">2 active deliveries</span> waiting for you.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Deliveries Completed"
          value="142"
          description="All time"
          icon={CheckCircle}
          trend={{ value: 15, label: 'vs last month' }}
          color="success"
        />
        <StatsCard
          title="Meals Delivered"
          value="3,280"
          description="Helped feed"
          icon={Star}
          color="accent"
        />
        <StatsCard
          title="Distance Covered"
          value="286 km"
          description="This month"
          icon={Route}
          color="primary"
        />
        <StatsCard
          title="Avg Delivery Time"
          value="28 min"
          description="Last 10 deliveries"
          icon={Timer}
          color="urgent"
        />
      </div>

      {/* Active Deliveries */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Delivery List */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Your assigned food pickups and deliveries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDeliveries.map((delivery) => {
              const status = statusConfig[delivery.status as keyof typeof statusConfig];
              const isSelected = selectedDelivery === delivery.id;

              return (
                <button
                  key={delivery.id}
                  onClick={() => setSelectedDelivery(delivery.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{delivery.donation.category}</span>
                      <div>
                        <h4 className="font-medium">{delivery.donation.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {delivery.donation.quantity} {delivery.donation.unit}
                        </p>
                      </div>
                    </div>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {delivery.distance} km
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Timer className="h-4 w-4" />
                      ~{delivery.estimatedTime} min
                    </div>
                  </div>
                </button>
              );
            })}

            {activeDeliveries.length === 0 && (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-medium mb-2">No active deliveries</h3>
                <p className="text-sm text-muted-foreground">
                  Check back soon for new delivery opportunities
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Details */}
        {selectedDelivery && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
              <CardDescription>Route and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const delivery = activeDeliveries.find((d) => d.id === selectedDelivery);
                if (!delivery) return null;
                const status = statusConfig[delivery.status as keyof typeof statusConfig];

                return (
                  <div className="space-y-6">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Delivery Progress</span>
                        <span className="text-muted-foreground">
                          {delivery.status === 'assigned' ? '0%' : delivery.status === 'picking_up' ? '33%' : '66%'}
                        </span>
                      </div>
                      <Progress
                        value={delivery.status === 'assigned' ? 0 : delivery.status === 'picking_up' ? 33 : 66}
                        className="h-2"
                      />
                    </div>

                    {/* Pickup Location */}
                    <div className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Navigation className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pickup</p>
                          <h4 className="font-medium">{delivery.pickup.name}</h4>
                          <p className="text-sm text-muted-foreground">{delivery.pickup.address}</p>
                          <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                            <Phone className="h-4 w-4 mr-2" />
                            {delivery.pickup.phone}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                    </div>

                    {/* Dropoff Location */}
                    <div className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-success/10">
                          <MapPin className="h-5 w-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Dropoff</p>
                          <h4 className="font-medium">{delivery.dropoff.name}</h4>
                          <p className="text-sm text-muted-foreground">{delivery.dropoff.address}</p>
                          <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                            <Phone className="h-4 w-4 mr-2" />
                            {delivery.dropoff.phone}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <Navigation className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                      <Button variant="hero" className="flex-1">
                        {delivery.status === 'in_transit' && <Camera className="h-4 w-4 mr-2" />}
                        {status.next}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
