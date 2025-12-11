import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  AlertTriangle,
  FileText,
  Settings,
  TrendingUp,
  Building2,
  Bike,
  Heart,
  Activity,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Donations', href: '/admin/donations', icon: Package },
  { label: 'Deliveries', href: '/admin/deliveries', icon: Truck },
  { label: 'Reports', href: '/admin/reports', icon: FileText, badge: '3' },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const recentActivity = [
  {
    id: 1,
    type: 'donation',
    message: 'New donation from Green Valley Restaurant',
    time: '2 minutes ago',
    icon: Package,
    color: 'text-primary',
  },
  {
    id: 2,
    type: 'delivery',
    message: 'Delivery completed by Alex Johnson',
    time: '15 minutes ago',
    icon: CheckCircle,
    color: 'text-success',
  },
  {
    id: 3,
    type: 'report',
    message: 'New abuse report submitted',
    time: '1 hour ago',
    icon: AlertTriangle,
    color: 'text-urgent',
  },
  {
    id: 4,
    type: 'user',
    message: 'New volunteer registered: Maria Garcia',
    time: '2 hours ago',
    icon: Users,
    color: 'text-accent-foreground',
  },
  {
    id: 5,
    type: 'delivery',
    message: 'Delivery failed - recipient unavailable',
    time: '3 hours ago',
    icon: XCircle,
    color: 'text-destructive',
  },
];

const topDonors = [
  { name: 'Green Valley Restaurant', donations: 156, meals: 4200 },
  { name: 'City Bakery', donations: 134, meals: 3800 },
  { name: 'Fresh Farms Market', donations: 98, meals: 2900 },
  { name: 'Corporate Caterers', donations: 87, meals: 2650 },
  { name: 'Sunset Diner', donations: 76, meals: 2100 },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Platform Overview</h2>
        <p className="text-muted-foreground">
          Monitor system health, user activity, and impact metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Users"
          value="12,456"
          description="Across all roles"
          icon={Users}
          trend={{ value: 8, label: 'vs last month' }}
          color="primary"
        />
        <StatsCard
          title="Active Donations"
          value="324"
          description="Awaiting pickup"
          icon={Package}
          trend={{ value: 12, label: 'vs last week' }}
          color="success"
        />
        <StatsCard
          title="Deliveries Today"
          value="89"
          description="Completed/In progress"
          icon={Truck}
          trend={{ value: 5, label: 'vs yesterday' }}
          color="accent"
        />
        <StatsCard
          title="Open Reports"
          value="3"
          description="Requires attention"
          icon={AlertTriangle}
          color="urgent"
        />
      </div>

      {/* User Distribution & Activity */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* User Distribution */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Active users by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Donors</span>
              </div>
              <div className="text-right">
                <span className="font-bold">2,340</span>
                <span className="text-sm text-muted-foreground ml-2">+12%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-accent-foreground" />
                <span className="font-medium">Recipients</span>
              </div>
              <div className="text-right">
                <span className="font-bold">8,750</span>
                <span className="text-sm text-muted-foreground ml-2">+8%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
              <div className="flex items-center gap-3">
                <Bike className="h-5 w-5 text-success" />
                <span className="font-medium">Volunteers</span>
              </div>
              <div className="text-right">
                <span className="font-bold">1,366</span>
                <span className="text-sm text-muted-foreground ml-2">+15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Donors & System Health */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Donors */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Donors</CardTitle>
              <CardDescription>Highest contributors this month</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topDonors.map((donor, index) => (
                <div
                  key={donor.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium">{donor.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{donor.donations}</span>
                    <span className="text-sm text-muted-foreground ml-1">donations</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Platform performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">API Response Time</p>
                  <p className="text-sm text-muted-foreground">Average latency</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-success">45ms</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">Uptime</p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-success">99.9%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Match Rate</p>
                  <p className="text-sm text-muted-foreground">Donations matched</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">94%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Truck className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium">Delivery Success</p>
                  <p className="text-sm text-muted-foreground">Completed on time</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-accent-foreground">98%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
