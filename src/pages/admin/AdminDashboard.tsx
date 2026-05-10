import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { ProfileSettingsContent } from '@/components/settings/ProfileSettingsContent';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Donations', href: '/admin/donations', icon: Package },
  { label: 'Deliveries', href: '/admin/deliveries', icon: Truck },
  { label: 'Reports', href: '/admin/reports', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const pageConfig = {
  '/admin': {
    title: 'Admin Dashboard',
    heading: 'Platform Overview',
    description: 'Monitor system health, user activity, and impact metrics.',
  },
  '/admin/users': {
    title: 'Admin Users',
    heading: 'User Management',
    description: 'Review accounts across donor, recipient, volunteer, and admin roles.',
  },
  '/admin/donations': {
    title: 'Admin Donations',
    heading: 'Donation Monitoring',
    description: 'Track donation volume, status, and recent activity across the platform.',
  },
  '/admin/deliveries': {
    title: 'Admin Deliveries',
    heading: 'Delivery Operations',
    description: 'Follow delivery pipeline status and identify items that need intervention.',
  },
  '/admin/reports': {
    title: 'Admin Reports',
    heading: 'Reports Center',
    description: 'Review operational summaries and issue indicators for follow-up.',
  },
  '/admin/settings': {
    title: 'Admin Settings',
    heading: 'Update Profile',
    description: 'Manage the admin account details shown across the platform.',
  },
} as const;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ');
}

export default function AdminDashboard() {
  const location = useLocation();
  const { data } = useQuery({ queryKey: ['admin-metrics'], queryFn: fetchAdminMetrics });
  const profiles = data?.profiles ?? [];
  const donations = data?.donations ?? [];
  const deliveries = data?.deliveries ?? [];
  const currentPage = pageConfig[location.pathname as keyof typeof pageConfig] ?? pageConfig['/admin'];
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

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
  const recentUsers = [...profiles].slice(0, 8);
  const recentDonations = [...donations].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 8);
  const recentDeliveries = [...deliveries].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 8);

  const renderOverview = () => (
    <>
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
            <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-foreground" />
                <span className="font-medium">Admins</span>
              </div>
              <span className="font-bold">{usersByRole.admin ?? 0}</span>
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
    </>
  );

  const renderUsers = () => (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="All Users" value={profiles.length} description="Registered accounts" icon={Users} color="primary" />
        <StatsCard title="Donors" value={usersByRole.donor ?? 0} description="Food providers" icon={Building2} color="success" />
        <StatsCard title="Recipients" value={usersByRole.recipient ?? 0} description="Receiving organizations" icon={Heart} color="accent" />
        <StatsCard title="Admins" value={usersByRole.admin ?? 0} description="Platform managers" icon={Settings} color="urgent" />
      </div>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest accounts available in the profile table</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {profile.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(profile.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderDonations = () => (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Donations" value={donations.length} description="All donation records" icon={Package} color="primary" />
        <StatsCard title="Available" value={donations.filter((d) => d.status === 'available').length} description="Ready to match" icon={Package} color="success" />
        <StatsCard title="In Transit" value={donations.filter((d) => d.status === 'in_transit').length} description="Currently moving" icon={Truck} color="accent" />
        <StatsCard title="Expired" value={donations.filter((d) => d.status === 'expired').length} description="Need review" icon={AlertTriangle} color="urgent" />
      </div>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Latest donation activity across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.title}</TableCell>
                  <TableCell>{profileById.get(donation.donor_id)?.name ?? 'Unknown donor'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {formatStatus(donation.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(donation.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderDeliveries = () => (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Deliveries" value={deliveries.length} description="All delivery records" icon={Truck} color="primary" />
        <StatsCard title="Assigned" value={deliveries.filter((d) => d.status === 'assigned').length} description="Waiting for pickup" icon={Truck} color="accent" />
        <StatsCard title="In Transit" value={deliveries.filter((d) => d.status === 'in_transit').length} description="Active deliveries" icon={Truck} color="success" />
        <StatsCard title="Failed" value={deliveries.filter((d) => d.status === 'failed').length} description="Require follow-up" icon={AlertTriangle} color="urgent" />
      </div>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
          <CardDescription>Latest updates from the delivery queue</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donation</TableHead>
                <TableHead>Volunteer</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">
                    {donations.find((donation) => donation.id === delivery.donation_id)?.title ?? 'Unknown donation'}
                  </TableCell>
                  <TableCell>{profileById.get(delivery.volunteer_id)?.name ?? 'Unassigned'}</TableCell>
                  <TableCell>{profileById.get(delivery.recipient_id)?.name ?? 'Unknown recipient'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {formatStatus(delivery.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(delivery.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Operational Summary</CardTitle>
          <CardDescription>High-level counts generated from platform data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
            <span>Total registered users</span>
            <Badge variant="secondary">{profiles.length}</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
            <span>Total donations created</span>
            <Badge variant="secondary">{donations.length}</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
            <span>Total deliveries logged</span>
            <Badge variant="secondary">{deliveries.length}</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
            <span>Active donation workload</span>
            <Badge variant="secondary">{activeDonations}</Badge>
          </div>
        </CardContent>
      </Card>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Attention Items</CardTitle>
          <CardDescription>Automatic flags based on current record status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-medium">Expired donations</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {donations.filter((d) => d.status === 'expired').length} records may need cleanup or audit.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-medium">Failed deliveries</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {deliveries.filter((d) => d.status === 'failed').length} deliveries need admin follow-up.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-medium">Admin coverage</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {usersByRole.admin ?? 0} admin accounts currently have dashboard access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <ProfileSettingsContent />
  );

  const renderContent = () => {
    switch (location.pathname) {
      case '/admin/users':
        return renderUsers();
      case '/admin/donations':
        return renderDonations();
      case '/admin/deliveries':
        return renderDeliveries();
      case '/admin/reports':
        return renderReports();
      case '/admin/settings':
        return renderSettings();
      case '/admin':
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
