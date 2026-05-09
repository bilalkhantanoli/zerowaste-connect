import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Search, Package, Clock, Heart, ShoppingBasket, Truck, MapPin, Calendar, Filter, AlertTriangle } from 'lucide-react';
import { fetchAvailableDonations, requestDonation } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', href: '/recipient', icon: LayoutDashboard },
  { label: 'Browse Food', href: '/recipient/browse', icon: Search },
  { label: 'My Requests', href: '/recipient/requests', icon: Package },
  { label: 'Deliveries', href: '/recipient/deliveries', icon: Truck },
  { label: 'History', href: '/recipient/history', icon: Clock },
];

export default function RecipientDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { data: donations = [] } = useQuery({ queryKey: ['available-donations'], queryFn: fetchAvailableDonations });
  const filteredDonations = donations.filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.category.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const getTimeLeft = (date: Date) => {
    const hours = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h left`;
    return `${Math.round(hours / 24)}d left`;
  };

  return (
    <DashboardLayout navItems={navItems} title="Recipient Dashboard">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name ?? 'Recipient'}!</h2>
        <p className="text-muted-foreground"><span className="text-primary font-semibold">{donations.length} donations</span> available near you today.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Meals Received" value={0} description="This month" icon={Heart} color="success" />
        <StatsCard title="Active Requests" value={0} description="Awaiting match" icon={ShoppingBasket} color="primary" />
        <StatsCard title="Incoming Deliveries" value={0} description="On the way" icon={Truck} color="accent" />
        <StatsCard title="Nearby Donations" value={donations.length} description="Currently available" icon={MapPin} color="urgent" />
      </div>
      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><CardTitle>Available Food Nearby</CardTitle><CardDescription>Browse and request available donations</CardDescription></div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search food..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" /></div>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDonations.map((donation) => (
              <Card key={donation.id} variant="interactive" className="overflow-hidden">
                <div className="aspect-video relative">
                  <img src={donation.images[0] ?? '/placeholder.svg'} alt={donation.title} className="w-full h-full object-cover" />
                  {donation.isUrgent && <Badge variant="urgent" className="absolute top-2 left-2"><AlertTriangle className="h-3 w-3 mr-1" />Urgent</Badge>}
                  <div className="absolute top-2 right-2"><Badge variant="secondary" className="backdrop-blur-sm">{donation.category.icon} {donation.category.name}</Badge></div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-1 line-clamp-1">{donation.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{donation.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Package className="h-3 w-3" />{donation.quantity} {donation.unit}</span>
                    <span className={`flex items-center gap-1 ${donation.isUrgent ? 'text-urgent' : ''}`}><Calendar className="h-3 w-3" />{getTimeLeft(donation.expiryDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3"><MapPin className="h-3 w-3" /><span className="truncate">{donation.donorName}</span></div>
                  <Button variant="default" size="sm" className="w-full" onClick={async () => { if (!user) return; await requestDonation(donation.id, user.id); toast.success('Food request sent'); }}>Request Food</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

