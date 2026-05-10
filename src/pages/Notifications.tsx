import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Notification } from '@/types';

function getRoleBase(role?: string) {
  switch (role) {
    case 'donor':
      return '/donor';
    case 'recipient':
      return '/recipient';
    case 'volunteer':
      return '/volunteer';
    case 'admin':
      return '/admin';
    default:
      return '/';
  }
}

function buildNotifications(userId: string, role?: string): Notification[] {
  return [
    {
      id: 'notif-1',
      userId,
      type: 'system',
      title: 'Welcome back',
      message: 'Your account is ready and your dashboard is up to date.',
      read: false,
      createdAt: new Date(),
    },
    {
      id: 'notif-2',
      userId,
      type: role === 'admin' ? 'system' : 'delivery',
      title: role === 'admin' ? 'Platform activity updated' : 'Delivery status updated',
      message:
        role === 'admin'
          ? 'New platform activity has been recorded in your dashboard reports.'
          : 'One of your recent delivery records has a status update.',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 'notif-3',
      userId,
      type: 'system',
      title: 'Profile reminder',
      message: 'Review your contact details to keep your account information current.',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ];
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const roleBase = getRoleBase(user?.role);
  const navItems = [
    { label: 'Dashboard', href: roleBase, icon: LayoutDashboard },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: '3' },
  ];
  const notifications = buildNotifications(user?.id ?? 'guest', user?.role);

  return (
    <DashboardLayout navItems={navItems} title="Notifications">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">Notifications</h2>
        <p className="text-muted-foreground">Recent updates for your account and activity.</p>
      </div>

      <div className="grid gap-6">
        {notifications.map((notification) => (
          <Card key={notification.id} variant="elevated">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <CardDescription>{notification.message}</CardDescription>
              </div>
              <Badge variant={notification.read ? 'secondary' : 'default'}>
                {notification.read ? 'Read' : 'New'}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span className="capitalize">{notification.type}</span>
              </div>
              <span>{notification.createdAt.toLocaleString()}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
