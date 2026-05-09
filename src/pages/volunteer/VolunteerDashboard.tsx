import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LayoutDashboard, Truck, Clock, Award, MapPin, Navigation, Phone, CheckCircle, ArrowRight, Star, Route, Timer } from 'lucide-react';
import { fetchVolunteerDeliveries } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/volunteer', icon: LayoutDashboard },
  { label: 'My Deliveries', href: '/volunteer/deliveries', icon: Truck },
  { label: 'History', href: '/volunteer/history', icon: Clock },
  { label: 'Achievements', href: '/volunteer/achievements', icon: Award },
];

const statusConfig = {
  assigned: { label: 'Ready for Pickup', color: 'bg-accent/10 text-accent-foreground', next: 'Start Pickup', progress: 0 },
  picking_up: { label: 'En Route to Pickup', color: 'bg-primary/10 text-primary', next: 'Confirm Pickup', progress: 33 },
  in_transit: { label: 'In Transit', color: 'bg-success/10 text-success', next: 'Confirm Delivery', progress: 66 },
};

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { data: deliveries = [] } = useQuery({
    queryKey: ['volunteer-deliveries', user?.id],
    queryFn: () => fetchVolunteerDeliveries(user!.id),
    enabled: !!user?.id,
  });
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const selected = deliveries.find((d) => d.id === selectedDelivery) ?? deliveries[0];

  return (
    <DashboardLayout navItems={navItems} title="Volunteer Dashboard">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Ready to make a difference, {user?.name ?? 'Volunteer'}!</h2>
        <p className="text-muted-foreground">You have <span className="text-primary font-semibold">{deliveries.length} active deliveries</span> waiting for you.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Deliveries Completed" value={0} description="All time" icon={CheckCircle} color="success" />
        <StatsCard title="Meals Delivered" value={deliveries.reduce((s, d) => s + (d.donation?.quantity ?? 0), 0)} description="Active loads" icon={Star} color="accent" />
        <StatsCard title="Distance Covered" value={`${deliveries.reduce((s, d) => s + (d.distance_km ?? 0), 0).toFixed(1)} km`} description="Current assignments" icon={Route} color="primary" />
        <StatsCard title="Avg Delivery Time" value={`${Math.round(deliveries.reduce((s, d) => s + (d.estimated_minutes ?? 0), 0) / Math.max(deliveries.length, 1))} min`} description="Estimated" icon={Timer} color="urgent" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader><CardTitle>Active Deliveries</CardTitle><CardDescription>Your assigned food pickups and deliveries</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {deliveries.map((delivery) => {
              const status = statusConfig[delivery.status as keyof typeof statusConfig];
              const isSelected = (selectedDelivery ?? selected?.id) === delivery.id;
              return (
                <button key={delivery.id} onClick={() => setSelectedDelivery(delivery.id)} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30'}`}>
                  <div className="flex items-start justify-between mb-3"><div><h4 className="font-medium">{delivery.donation?.title ?? 'Donation'}</h4><p className="text-sm text-muted-foreground">{delivery.donation?.quantity ?? 0} {delivery.donation?.unit ?? 'items'}</p></div><Badge className={status.color}>{status.label}</Badge></div>
                  <div className="grid grid-cols-2 gap-4 text-sm"><div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{delivery.distance_km ?? 0} km</div><div className="flex items-center gap-2 text-muted-foreground"><Timer className="h-4 w-4" />~{delivery.estimated_minutes ?? 0} min</div></div>
                </button>
              );
            })}
          </CardContent>
        </Card>
        {selected && (
          <Card variant="elevated">
            <CardHeader><CardTitle>Delivery Details</CardTitle><CardDescription>Route and contact information</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div><div className="flex justify-between text-sm mb-2"><span>Delivery Progress</span><span className="text-muted-foreground">{statusConfig[selected.status as keyof typeof statusConfig].progress}%</span></div><Progress value={statusConfig[selected.status as keyof typeof statusConfig].progress} className="h-2" /></div>
              <div className="p-4 rounded-xl bg-muted/30"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pickup</p><h4 className="font-medium">{selected.donation?.donor?.name ?? 'Donor'}</h4><p className="text-sm text-muted-foreground">{selected.donation?.address ?? '-'}</p><Button variant="ghost" size="sm" className="mt-2 -ml-2"><Phone className="h-4 w-4 mr-2" />{selected.donation?.donor?.phone ?? 'N/A'}</Button></div>
              <div className="flex justify-center"><ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" /></div>
              <div className="p-4 rounded-xl bg-muted/30"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Dropoff</p><h4 className="font-medium">{selected.recipient?.name ?? 'Recipient'}</h4><p className="text-sm text-muted-foreground">{selected.recipient?.address ?? '-'}</p><Button variant="ghost" size="sm" className="mt-2 -ml-2"><Phone className="h-4 w-4 mr-2" />{selected.recipient?.phone ?? 'N/A'}</Button></div>
              <div className="flex gap-3"><Button variant="outline" className="flex-1"><Navigation className="h-4 w-4 mr-2" />Navigate</Button><Button variant="hero" className="flex-1">{statusConfig[selected.status as keyof typeof statusConfig].next}</Button></div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

