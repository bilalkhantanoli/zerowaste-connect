import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Phone, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function ProfileSettingsContent() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: 'USA',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name ?? '',
      phone: user.phone ?? '',
      address: user.location?.address ?? '',
      city: user.location?.city ?? '',
      country: user.location?.country ?? 'USA',
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again later.';
      toast.error('Unable to update profile', { description: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Keep your account details current for matching and deliveries.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name or organization"
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  disabled={isSaving}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>Your current role and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm text-muted-foreground">Role</span>
            <Badge variant="secondary" className="capitalize">
              {user?.role}
            </Badge>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user?.phone || 'No phone added yet'}</span>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {user?.location?.address
                ? `${user.location.address}, ${user.location.city}, ${user.location.country}`
                : 'No address added yet'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
