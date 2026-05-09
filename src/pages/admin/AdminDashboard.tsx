import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  AlertTriangle,
  FileText,
  Settings,
  Building2,
  Bike,
  Heart,
} from 'lucide-react';
import { fetchAdminMetrics } from '@/lib/api';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Donations', href: '/admin/donations', icon: Package },
  { label: 'Deliveries', href: '/admin/deliveries', icon: Truck },
  { label: 'Reports', href: '/admin/reports', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminDashboard() {
  const { data } = useQuery({ queryKey: ['admin-metrics'], queryFn: fetchAdminMetrics });
  const profiles = data?.profiles ?? [];
  const donations = data?.donations ?? [];
  const deliveries = data?.deliveries ?? [];

  const usersByRole = profiles.reduce<Record<string, number>>(
    (acc, p) => ({ ...acc, [p.role]: (acc[p.role] ?? 0) + 1 }),
    {},
  );
  const activeDonations = donations.filter((d) =>
    ['available', 'matched', 'reserved', 'in_transit'].includes(d.status),
  ).length;
  const deliveriesToday = deliveries.filter(
    (d) => d.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10),
  ).length;

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">Platform Overview</h2>
        <p className="text-muted-foreground">
          Monitor system health, user activity, and impact metrics.
        </p>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={profiles.length}
          description="Across all roles"
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="Active Donations"
          value={activeDonations}
          description="Awaiting pickup"
          icon={Package}
          color="success"
        />
        <StatsCard
          title="Deliveries Today"
          value={deliveriesToday}
          description="Completed/In progress"
          icon={Truck}
          color="accent"
        />
        <StatsCard
          title="Open Reports"
          value={0}
          description="Requires attention"
          icon={AlertTriangle}
          color="urgent"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Active users by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Donors</span>
              </div>
              <span className="font-bold">{usersByRole.donor ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-accent/10 p-3">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-accent-foreground" />
                <span className="font-medium">Recipients</span>
              </div>
              <span className="font-bold">{usersByRole.recipient ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-success/10 p-3">
              <div className="flex items-center gap-3">
                <Bike className="h-5 w-5 text-success" />
                <span className="font-medium">Volunteers</span>
              </div>
              <span className="font-bold">{usersByRole.volunteer ?? 0}</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Top Donors</CardTitle>
            <CardDescription>Highest contributors by donation count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                donations.reduce<Record<string, number>>(
                  (acc, d) => ({ ...acc, [d.donor_id]: (acc[d.donor_id] ?? 0) + 1 }),
                  {},
                ),
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([donorId, count], index) => (
                  <div
                    key={donorId}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium">{donorId.slice(0, 8)}...</span>
                    </div>
                    <Badge variant="secondary">{count} donations</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
