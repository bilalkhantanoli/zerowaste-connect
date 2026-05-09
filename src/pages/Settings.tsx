import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const roleBase = user?.role ? `/${user.role}` : '/';
  const navItems = [
    { label: 'Dashboard', href: roleBase, icon: LayoutDashboard },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Settings">
      <Card variant="elevated" className="max-w-2xl">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Account settings screen is now routed correctly.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Profile settings can be expanded here without breaking navigation.
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

