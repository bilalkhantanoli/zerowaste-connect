import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Clock,
  TrendingUp,
  Users,
  Leaf,
  ArrowRight,
  MapPin,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';
import { fetchDonorDonations } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/donor', icon: LayoutDashboard },
  { label: 'Add Donation', href: '/donor/add', icon: PlusCircle },
  { label: 'My Donations', href: '/donor/donations', icon: Package },
  { label: 'History', href: '/donor/history', icon: Clock },
];

const statusConfig = {
  available: { label: 'Available', variant: 'success' as const },
  reserved: { label: 'Reserved', variant: 'accent' as const },
  matched: { label: 'Matched', variant: 'default' as const },
  in_transit: { label: 'In Transit', variant: 'accent' as const },
  delivered: { label: 'Delivered', variant: 'muted' as const },
  expired: { label: 'Expired', variant: 'destructive' as const },
};

export default function DonorDashboard() {
  const { user } = useAuth();
  const { data: recentDonations = [] } = useQuery({
    queryKey: ['donor-donations', user?.id],
    queryFn: () => fetchDonorDonations(user!.id),
    enabled: !!user?.id,
  });

  const totalDonations = recentDonations.length;
  const activeDonations = recentDonations.filter((d) =>
    ['available', 'matched', 'in_transit', 'reserved'].includes(d.status),
  ).length;
  const mealsSaved = recentDonations.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <DashboardLayout navItems={navItems} title="Donor Dashboard">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">Welcome back, {user?.name ?? 'Donor'}!</h2>
        <p className="text-muted-foreground">
          You currently have{' '}
          <span className="font-semibold text-primary">{activeDonations} active donations</span>.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Donations"
          value={totalDonations}
          description="All time"
          icon={Package}
          color="primary"
        />
        <StatsCard
          title="Meals Saved"
          value={mealsSaved}
          description="Based on listed quantity"
          icon={Users}
          color="success"
        />
        <StatsCard
          title="CO2 Reduced"
          value={`${Math.round(mealsSaved * 0.33)}kg`}
          description="Estimated"
          icon={Leaf}
          color="accent"
        />
        <StatsCard
          title="Active Donations"
          value={activeDonations}
          description="Awaiting pickup"
          icon={Clock}
          color="urgent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="elevated" className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="hero" className="w-full justify-start" asChild>
              <Link to="/donor/add">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Donation
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/donor/donations">
                <Package className="mr-2 h-5 w-5" />
                View All Donations
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/donor/history">
                <TrendingUp className="mr-2 h-5 w-5" />
                View Impact Report
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your latest food donations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/donor/donations">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.map((donation) => {
                const status = statusConfig[donation.status];
                const expiryHours = Math.round(
                  (donation.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60),
                );
                return (
                  <div
                    key={donation.id}
                    className="flex items-start gap-4 rounded-xl bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                      {donation.category.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{donation.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {donation.quantity} {donation.unit}
                          </p>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {donation.location.city}
                        </span>
                        <span
                          className={`flex items-center gap-1 ${expiryHours < 12 ? 'text-urgent' : ''}`}
                        >
                          <Calendar className="h-3 w-3" />
                          {expiryHours < 24
                            ? `${expiryHours}h left`
                            : `${Math.round(expiryHours / 24)}d left`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
