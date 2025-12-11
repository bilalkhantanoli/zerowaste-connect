import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  CheckCircle,
  TrendingUp,
  Users,
  Leaf,
  ArrowRight,
  MapPin,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';
import { Donation } from '@/types';

const navItems = [
  { label: 'Dashboard', href: '/donor', icon: LayoutDashboard },
  { label: 'Add Donation', href: '/donor/add', icon: PlusCircle },
  { label: 'My Donations', href: '/donor/donations', icon: Package },
  { label: 'History', href: '/donor/history', icon: Clock },
];

// Mock data
const recentDonations: Donation[] = [
  {
    id: '1',
    donorId: 'd1',
    donorName: 'Green Valley Restaurant',
    title: 'Fresh Salad Mix',
    description: 'Assorted fresh salad greens and vegetables',
    category: { id: 'c1', name: 'Vegetables', icon: '🥬' },
    quantity: 15,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    images: [],
    location: { lat: 40.7128, lng: -74.006, address: '123 Food Street', city: 'New York', country: 'USA' },
    status: 'available',
    isUrgent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    donorId: 'd1',
    donorName: 'Green Valley Restaurant',
    title: 'Bread & Pastries',
    description: 'Assorted bread and pastries from today',
    category: { id: 'c2', name: 'Bakery', icon: '🍞' },
    quantity: 25,
    unit: 'items',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    images: [],
    location: { lat: 40.7128, lng: -74.006, address: '123 Food Street', city: 'New York', country: 'USA' },
    status: 'matched',
    isUrgent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    donorId: 'd1',
    donorName: 'Green Valley Restaurant',
    title: 'Cooked Meals',
    description: 'Prepared meals from catering event',
    category: { id: 'c3', name: 'Prepared Food', icon: '🍱' },
    quantity: 50,
    unit: 'meals',
    expiryDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
    images: [],
    location: { lat: 40.7128, lng: -74.006, address: '123 Food Street', city: 'New York', country: 'USA' },
    status: 'in_transit',
    isUrgent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
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
  return (
    <DashboardLayout navItems={navItems} title="Donor Dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Green Valley! 🌿</h2>
        <p className="text-muted-foreground">
          You've helped save <span className="text-primary font-semibold">2,450 meals</span> this month. Keep up the amazing work!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Donations"
          value="156"
          description="All time"
          icon={Package}
          trend={{ value: 12, label: 'vs last month' }}
          color="primary"
        />
        <StatsCard
          title="Meals Saved"
          value="2,450"
          description="This month"
          icon={Users}
          trend={{ value: 23, label: 'vs last month' }}
          color="success"
        />
        <StatsCard
          title="CO₂ Reduced"
          value="820kg"
          description="This month"
          icon={Leaf}
          trend={{ value: 18, label: 'vs last month' }}
          color="accent"
        />
        <StatsCard
          title="Active Donations"
          value="8"
          description="Awaiting pickup"
          icon={Clock}
          color="urgent"
        />
      </div>

      {/* Quick Actions & Recent Donations */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
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

        {/* Recent Donations */}
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
                const expiryHours = Math.round((donation.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60));

                return (
                  <div
                    key={donation.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      {donation.category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{donation.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {donation.quantity} {donation.unit}
                          </p>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {donation.location.city}
                        </span>
                        <span className={`flex items-center gap-1 ${expiryHours < 12 ? 'text-urgent' : ''}`}>
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
