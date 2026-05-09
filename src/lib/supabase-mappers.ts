import type { Donation, User, UserRole } from '@/types';
import type { Database } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type DonationRow = Database['public']['Tables']['donations']['Row'];

export function mapProfileToUser(profile: ProfileRow, email: string): User {
  return {
    id: profile.id,
    email,
    name: profile.name,
    role: profile.role as UserRole,
    avatar: profile.avatar_url ?? undefined,
    phone: profile.phone ?? undefined,
    rating: profile.rating,
    verified: profile.verified,
    createdAt: new Date(profile.created_at),
    location: profile.address
      ? {
          lat: profile.lat ?? 0,
          lng: profile.lng ?? 0,
          address: profile.address,
          city: profile.city ?? 'Unknown',
          country: profile.country ?? 'Unknown',
        }
      : undefined,
  };
}

export function buildPublicUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  const { data } = supabase.storage.from('donation-images').getPublicUrl(path);
  return data.publicUrl;
}

export function mapDonationRow(
  row: DonationRow & {
    donor?: Pick<ProfileRow, 'name'> | null;
    category?: Database['public']['Tables']['food_categories']['Row'] | null;
    donation_images?: Database['public']['Tables']['donation_images']['Row'][] | null;
  }
): Donation {
  const imageUrls = (row.donation_images ?? []).map((img) => buildPublicUrl(img.path)).filter(Boolean) as string[];

  return {
    id: row.id,
    donorId: row.donor_id,
    donorName: row.donor?.name ?? 'Unknown donor',
    title: row.title,
    description: row.description,
    category: {
      id: row.category?.id ?? row.category_id,
      name: row.category?.name ?? 'Other',
      icon: row.category?.icon ?? '🍱',
    },
    quantity: row.quantity,
    unit: row.unit,
    expiryDate: new Date(row.expiry_at),
    images: imageUrls,
    location: {
      lat: row.lat ?? 0,
      lng: row.lng ?? 0,
      address: row.address,
      city: row.city,
      country: row.country,
    },
    status: row.status,
    isUrgent: row.is_urgent,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

