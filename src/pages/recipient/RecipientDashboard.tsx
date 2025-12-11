import { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Donation } from '@/types';

const navItems = [
  { label: 'Dashboard', href: '/recipient', icon: LayoutDashboard },
  { label: 'Browse Food', href: '/recipient/browse', icon: Search },
  { label: 'My Requests', href: '/recipient/requests', icon: Package },
  { label: 'Deliveries', href: '/recipient/deliveries', icon: Truck, badge: '2' },
  { label: 'History', href: '/recipient/history', icon: Clock },
];

// Mock available donations
const availableDonations: Donation[] = [
  {
    id: '1',
    donorId: 'd1',
    donorName: 'Green Valley Restaurant',
    title: 'Fresh Salad Mix',
    description: 'Assorted fresh salad greens, tomatoes, and vegetables. Perfect for salads.',
    category: { id: 'c1', name: 'Vegetables', icon: '🥬' },
    quantity: 15,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'],
    location: { lat: 40.7128, lng: -74.006, address: '123 Food Street', city: 'New York', country: 'USA' },
    status: 'available',
    isUrgent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    donorId: 'd2',
    donorName: 'City Bakery',
    title: 'Fresh Bread & Pastries',
    description: 'Assorted bread loaves, croissants, and pastries baked today.',
    category: { id: 'c2', name: 'Bakery', icon: '🍞' },
    quantity: 30,
    unit: 'items',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'],
    location: { lat: 40.7282, lng: -73.7949, address: '456 Baker Lane', city: 'New York', country: 'USA' },
    status: 'available',
    isUrgent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    donorId: 'd3',
    donorName: 'Fresh Farms Market',
    title: 'Seasonal Fruits',
    description: 'Apples, oranges, bananas, and seasonal berries.',
    category: { id: 'c3', name: 'Fruits', icon: '🍎' },
    quantity: 20,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    images: ['https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400'],
    location: { lat: 40.7589, lng: -73.9851, address: '789 Market Ave', city: 'New York', country: 'USA' },
    status: 'available',
    isUrgent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    donorId: 'd4',
    donorName: 'Corporate Caterers',
    title: 'Hot Prepared Meals',
    description: 'Chicken, rice, and vegetable meals from corporate event.',
    category: { id: 'c4', name: 'Prepared Food', icon: '🍱' },
    quantity: 45,
    unit: 'meals',
    expiryDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],
    location: { lat: 40.7484, lng: -73.9857, address: '321 Corporate Blvd', city: 'New York', country: 'USA' },
    status: 'available',
    isUrgent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function RecipientDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDonations = availableDonations.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeLeft = (date: Date) => {
    const hours = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h left`;
    return `${Math.round(hours / 24)}d left`;
  };

  return (
    <DashboardLayout navItems={navItems} title="Recipient Dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome, Hope Community Center! 💚</h2>
        <p className="text-muted-foreground">
          <span className="text-primary font-semibold">12 new donations</span> available near you today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Meals Received"
          value="1,230"
          description="This month"
          icon={Heart}
          trend={{ value: 18, label: 'vs last month' }}
          color="success"
        />
        <StatsCard
          title="Active Requests"
          value="3"
          description="Awaiting match"
          icon={ShoppingBasket}
          color="primary"
        />
        <StatsCard
          title="Incoming Deliveries"
          value="2"
          description="On the way"
          icon={Truck}
          color="accent"
        />
        <StatsCard
          title="Nearby Donations"
          value="12"
          description="Within 5km"
          icon={MapPin}
          color="urgent"
        />
      </div>

      {/* Search & Available Food */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Available Food Nearby</CardTitle>
              <CardDescription>Browse and request available donations</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDonations.map((donation) => (
              <Card
                key={donation.id}
                variant="interactive"
                className="overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img
                    src={donation.images[0]}
                    alt={donation.title}
                    className="w-full h-full object-cover"
                  />
                  {donation.isUrgent && (
                    <Badge variant="urgent" className="absolute top-2 left-2">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="backdrop-blur-sm">
                      {donation.category.icon} {donation.category.name}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-1 line-clamp-1">{donation.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {donation.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {donation.quantity} {donation.unit}
                    </span>
                    <span className={`flex items-center gap-1 ${donation.isUrgent ? 'text-urgent' : ''}`}>
                      <Calendar className="h-3 w-3" />
                      {getTimeLeft(donation.expiryDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{donation.donorName}</span>
                  </div>
                  <Button variant="default" size="sm" className="w-full">
                    Request Food
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDonations.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium mb-2">No matching donations</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or check back later
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
