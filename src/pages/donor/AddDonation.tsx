import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { createDonation, fetchFoodCategories, uploadDonationImage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/donor', icon: LayoutDashboard },
  { label: 'Add Donation', href: '/donor/add', icon: PlusCircle },
  { label: 'My Donations', href: '/donor/donations', icon: Package },
  { label: 'History', href: '/donor/history', icon: Clock },
];

const units = ['kg', 'lbs', 'items', 'meals', 'liters', 'packages'];

export default function AddDonation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [images, setImages] = useState<File[]>([]);
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

  const { data: categories = [] } = useQuery({
    queryKey: ['food-categories'],
    queryFn: fetchFoodCategories,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('You must be logged in');
      const imagePaths = await Promise.all(
        images.map((file) => uploadDonationImage(user.id, file)),
      );
      const expiryAt = new Date(
        `${formData.expiryDate}T${formData.expiryTime || '23:59'}`,
      ).toISOString();
      return createDonation({
        donorId: user.id,
        title: formData.title,
        description: formData.description,
        categoryId: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        expiryAt,
        address: formData.address,
        isUrgent: formData.isUrgent,
        notes: formData.notes,
        imagePaths,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['donor-donations', user?.id] });
      toast.success('Donation created successfully!', {
        description: 'Your donation is now visible to nearby recipients.',
      });
      navigate('/donor');
    },
    onError: (error: Error) => {
      toast.error('Failed to create donation', { description: error.message });
    },
  });

  const isLoading = createMutation.isPending;
  const previews = images.map((file) => URL.createObjectURL(file));

  return (
    <DashboardLayout navItems={navItems} title="Add Donation">
      <div className="mx-auto max-w-3xl">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              Create New Donation
            </CardTitle>
            <CardDescription>
              Share your surplus food with those in need. Provide accurate details to help match
              with recipients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate();
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    required
                    disabled={isLoading}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    disabled={isLoading}
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
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
                        type="number"
                        min="1"
                        required
                        disabled={isLoading}
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
              <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Expiry & Location
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      required
                      disabled={isLoading}
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryTime">Expiry Time</Label>
                    <Input
                      id="expiryTime"
                      type="time"
                      disabled={isLoading}
                      value={formData.expiryTime}
                      onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Pickup Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="address"
                      required
                      disabled={isLoading}
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Photos
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {previews.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <img src={image} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute right-1 top-1 rounded-full bg-foreground/80 p-1 text-background hover:bg-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary/50">
                      <ImageIcon className="mb-1 h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={isLoading}
                        onChange={(e) =>
                          setImages([...images, ...Array.from(e.target.files ?? [])].slice(0, 5))
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-urgent/10 p-2">
                      <AlertTriangle className="h-5 w-5 text-urgent" />
                    </div>
                    <div>
                      <Label htmlFor="urgent" className="cursor-pointer text-base">
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
