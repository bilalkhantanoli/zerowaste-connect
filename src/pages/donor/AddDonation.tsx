import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Clock,
  Upload,
  MapPin,
  AlertTriangle,
  Loader2,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', href: '/donor', icon: LayoutDashboard },
  { label: 'Add Donation', href: '/donor/add', icon: PlusCircle },
  { label: 'My Donations', href: '/donor/donations', icon: Package },
  { label: 'History', href: '/donor/history', icon: Clock },
];

const foodCategories = [
  { id: '1', name: 'Vegetables', icon: '🥬' },
  { id: '2', name: 'Fruits', icon: '🍎' },
  { id: '3', name: 'Bakery', icon: '🍞' },
  { id: '4', name: 'Dairy', icon: '🧀' },
  { id: '5', name: 'Prepared Food', icon: '🍱' },
  { id: '6', name: 'Meat & Seafood', icon: '🥩' },
  { id: '7', name: 'Canned Goods', icon: '🥫' },
  { id: '8', name: 'Beverages', icon: '🥤' },
];

const units = ['kg', 'lbs', 'items', 'meals', 'liters', 'packages'];

export default function AddDonation() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    expiryTime: '',
    address: '',
    isUrgent: false,
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate image upload with placeholder URLs
      const newImages = Array.from(files).map((_, i) => 
        `https://picsum.photos/400/300?random=${Date.now() + i}`
      );
      setImages([...images, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success('Donation created successfully!', {
        description: 'Your donation is now visible to nearby recipients.',
      });
      
      navigate('/donor');
    } catch (error) {
      toast.error('Failed to create donation', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Add Donation">
      <div className="max-w-3xl mx-auto">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              Create New Donation
            </CardTitle>
            <CardDescription>
              Share your surplus food with those in need. Provide accurate details to help match with recipients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Basic Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Fresh Salad Mix from Today's Service"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the food items, condition, and any special notes..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {foodCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        placeholder="10"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) => setFormData({ ...formData, unit: value })}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expiry & Location */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Expiry & Location
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryTime">Expiry Time</Label>
                    <Input
                      id="expiryTime"
                      name="expiryTime"
                      type="time"
                      value={formData.expiryTime}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Pickup Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter pickup address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Photos
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img src={image} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-foreground/80 text-background hover:bg-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isLoading}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Add up to 5 photos. Clear photos help recipients and improve matching.
                </p>
              </div>

              {/* Urgency */}
              <div className="p-4 rounded-xl border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-urgent/10">
                      <AlertTriangle className="h-5 w-5 text-urgent" />
                    </div>
                    <div>
                      <Label htmlFor="urgent" className="text-base cursor-pointer">
                        Mark as Urgent
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Food expiring within 24 hours gets priority matching
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="urgent"
                    checked={formData.isUrgent}
                    onCheckedChange={(checked) => setFormData({ ...formData, isUrgent: checked })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/donor')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Donation...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Create Donation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
