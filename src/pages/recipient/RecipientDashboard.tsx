import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Search,
  Package,
  Clock,
  Heart,
  ShoppingBasket,
  Truck,
  MapPin,
  Calendar,
  Filter,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchAvailableDonations,
  fetchRecipientDeliveries,
  fetchRecipientRequests,
  requestDonation,
} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', href: '/recipient', icon: LayoutDashboard },
  { label: 'Browse Food', href: '/recipient/browse', icon: Search },
  { label: 'My Requests', href: '/recipient/requests', icon: Package },
  { label: 'Deliveries', href: '/recipient/deliveries', icon: Truck },
  { label: 'History', href: '/recipient/history', icon: Clock },
];

const requestStatusConfig = {
  pending: { label: 'Requested', variant: 'accent' as const },
  matched: { label: 'Matched', variant: 'default' as const },
  fulfilled: { label: 'Fulfilled', variant: 'success' as const },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const },
};

const deliveryStatusConfig = {
  assigned: { label: 'Assigned', variant: 'secondary' as const },
  picking_up: { label: 'Picking Up', variant: 'accent' as const },
  in_transit: { label: 'In Transit', variant: 'default' as const },
  delivered: { label: 'Delivered', variant: 'success' as const },
  failed: { label: 'Failed', variant: 'destructive' as const },
};

export default function RecipientDashboard() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const { data: donations = [] } = useQuery({
    queryKey: ['available-donations'],
    queryFn: fetchAvailableDonations,
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['recipient-requests', user?.id],
    queryFn: () => fetchRecipientRequests(user!.id),
    enabled: !!user?.id,
  });

  const { data: deliveries = [] } = useQuery({
    queryKey: ['recipient-deliveries', user?.id],
    queryFn: () => fetchRecipientDeliveries(user!.id),
    enabled: !!user?.id,
  });

  const requestMutation = useMutation({
    mutationFn: async (donationId: string) => {
      if (!user) throw new Error('You must be signed in');
      await requestDonation(donationId, user.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipient-requests', user?.id] });
      toast.success('Food request sent');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Please try again later.';
      toast.error('Unable to send request', { description: message });
    },
  });

  const filteredDonations = donations.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const requestedDonationIds = new Set(
    requests
      .filter((request) => request.status === 'pending' || request.status === 'matched')
      .map((request) => request.donationId)
      .filter((id): id is string => Boolean(id)),
  );

  const activeRequests = requests.filter((request) =>
    ['pending', 'matched'].includes(request.status),
  );
  const requestHistory = requests.filter((request) =>
    ['fulfilled', 'cancelled'].includes(request.status),
  );
  const activeDeliveries = deliveries.filter((delivery) =>
    ['assigned', 'picking_up', 'in_transit'].includes(delivery.status),
  );
  const deliveryHistory = deliveries.filter((delivery) =>
    ['delivered', 'failed'].includes(delivery.status),
  );

  const getTimeLeft = (date: Date) => {
    const hours = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h left`;
    return `${Math.round(hours / 24)}d left`;
  };

  const pageConfig = {
    '/recipient': {
      title: 'Recipient Dashboard',
      heading: `Welcome, ${user?.name ?? 'Recipient'}!`,
      description: (
        <>
          <span className="font-semibold text-primary">{donations.length} donations</span>{' '}
          available near you today.
        </>
      ),
    },
    '/recipient/browse': {
      title: 'Browse Food',
      heading: 'Browse Food',
      description: 'Search nearby food donations and send requests.',
    },
    '/recipient/requests': {
      title: 'My Requests',
      heading: 'My Requests',
      description: 'Track your pending and matched food requests.',
    },
    '/recipient/deliveries': {
      title: 'Deliveries',
      heading: 'Deliveries',
      description: 'Follow food deliveries assigned to your organization.',
    },
    '/recipient/history': {
      title: 'History',
      heading: 'History',
      description: 'Review completed requests and past deliveries.',
    },
  } as const;

  const currentPage =
    pageConfig[location.pathname as keyof typeof pageConfig] ?? pageConfig['/recipient'];

  const renderBrowseGrid = () => (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Available Food Nearby</CardTitle>
            <CardDescription>Browse and request available donations</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDonations.map((donation) => {
            const isRequested = requestedDonationIds.has(donation.id);
            const isSubmitting =
              requestMutation.isPending && requestMutation.variables === donation.id;

            return (
              <Card key={donation.id} variant="interactive" className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={donation.images[0] ?? '/placeholder.svg'}
                    alt={donation.title}
                    className="h-full w-full object-cover"
                  />
                  {donation.isUrgent && (
                    <Badge variant="urgent" className="absolute left-2 top-2">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Urgent
                    </Badge>
                  )}
                  <div className="absolute right-2 top-2">
                    <Badge variant="secondary" className="backdrop-blur-sm">
                      {donation.category.icon} {donation.category.name}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="mb-1 line-clamp-1 font-semibold">{donation.title}</h4>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {donation.description}
                  </p>
                  <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {donation.quantity} {donation.unit}
                    </span>
                    <span
                      className={`flex items-center gap-1 ${donation.isUrgent ? 'text-urgent' : ''}`}
                    >
                      <Calendar className="h-3 w-3" />
                      {getTimeLeft(donation.expiryDate)}
                    </span>
                  </div>
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{donation.donorName}</span>
                  </div>
                  <Button
                    variant={isRequested ? 'outline' : 'default'}
                    size="sm"
                    className="w-full"
                    disabled={!user || isRequested || isSubmitting}
                    onClick={() => requestMutation.mutate(donation.id)}
                  >
                    {isRequested ? 'Requested' : isSubmitting ? 'Requesting...' : 'Request Food'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {filteredDonations.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No matching donations found right now.
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderRequests = (items: typeof requests, title: string, description: string, empty: string) => (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((request) => {
          const status = requestStatusConfig[request.status as keyof typeof requestStatusConfig];
          return (
            <div key={request.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium">{request.donation?.title ?? 'Food request'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {request.donation
                      ? `${request.donation.quantity} ${request.donation.unit} from ${request.donation.donorName}`
                      : 'Donation details unavailable'}
                  </p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShoppingBasket className="h-3 w-3" />
                  Quantity requested: {request.quantity}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="rounded-xl bg-muted/30 p-8 text-center text-sm text-muted-foreground">
            {empty}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDeliveries = (
    items: typeof deliveries,
    title: string,
    description: string,
    empty: string,
  ) => (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((delivery) => {
          const status = deliveryStatusConfig[delivery.status as keyof typeof deliveryStatusConfig];
          return (
            <div key={delivery.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium">{delivery.donation?.title ?? 'Delivery'}</h4>
                  <p className="text-sm text-muted-foreground">
                    Volunteer: {delivery.volunteer?.name ?? 'Unassigned'}
                  </p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {delivery.donation?.quantity ?? 0} {delivery.donation?.unit ?? 'items'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(delivery.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {delivery.donation?.address ?? 'Pickup address unavailable'}
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {delivery.estimated_minutes ? `~${delivery.estimated_minutes} min` : 'ETA pending'}
                </span>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="rounded-xl bg-muted/30 p-8 text-center text-sm text-muted-foreground">
            {empty}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderOverview = () => (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Meals Received"
          value={requestHistory.filter((request) => request.status === 'fulfilled').length}
          description="Completed requests"
          icon={Heart}
          color="success"
        />
        <StatsCard
          title="Active Requests"
          value={activeRequests.length}
          description="Awaiting match"
          icon={ShoppingBasket}
          color="primary"
        />
        <StatsCard
          title="Incoming Deliveries"
          value={activeDeliveries.length}
          description="On the way"
          icon={Truck}
          color="accent"
        />
        <StatsCard
          title="Nearby Donations"
          value={donations.length}
          description="Currently available"
          icon={MapPin}
          color="urgent"
        />
      </div>
      {renderBrowseGrid()}
    </>
  );

  const renderHistory = () => (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Completed Requests"
          value={requestHistory.filter((request) => request.status === 'fulfilled').length}
          description="Food received"
          icon={CheckCircle2}
          color="success"
        />
        <StatsCard
          title="Cancelled Requests"
          value={requestHistory.filter((request) => request.status === 'cancelled').length}
          description="Not completed"
          icon={Clock}
          color="urgent"
        />
        <StatsCard
          title="Delivered Orders"
          value={deliveryHistory.filter((delivery) => delivery.status === 'delivered').length}
          description="Finished deliveries"
          icon={Truck}
          color="primary"
        />
        <StatsCard
          title="Failed Deliveries"
          value={deliveryHistory.filter((delivery) => delivery.status === 'failed').length}
          description="Need follow-up"
          icon={AlertTriangle}
          color="accent"
        />
      </div>
      {renderRequests(
        requestHistory,
        'Request History',
        'Previously completed and cancelled food requests.',
        'No request history yet.',
      )}
      {renderDeliveries(
        deliveryHistory,
        'Delivery History',
        'Completed and failed deliveries.',
        'No delivery history yet.',
      )}
    </div>
  );

  const renderContent = () => {
    switch (location.pathname) {
      case '/recipient/browse':
        return renderBrowseGrid();
      case '/recipient/requests':
        return renderRequests(
          activeRequests,
          'My Requests',
          'Pending and matched requests for food donations.',
          'No active requests yet.',
        );
      case '/recipient/deliveries':
        return renderDeliveries(
          activeDeliveries,
          'Incoming Deliveries',
          'Food deliveries currently assigned to your organization.',
          'No active deliveries right now.',
        );
      case '/recipient/history':
        return renderHistory();
      case '/recipient':
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
