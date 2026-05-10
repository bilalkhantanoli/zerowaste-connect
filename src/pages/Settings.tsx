import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileSettingsContent } from '@/components/settings/ProfileSettingsContent';

export default function SettingsPage() {
  const { user } = useAuth();
  const roleBase = user?.role ? `/${user.role}` : '/';
  const navItems = [
    { label: 'Dashboard', href: roleBase, icon: LayoutDashboard },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Settings">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">Update the profile details shown across your account.</p>
      </div>
      <ProfileSettingsContent />
    </DashboardLayout>
  );
}
