import { supabase } from '@/integrations/supabase/client';
import { mapDonationRow, mapProfileToUser } from '@/lib/supabase-mappers';
import type { UserRole } from '@/types';

async function ensureProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  const metadata = user.user_metadata ?? {};
  const role = (metadata.role as UserRole) ?? 'donor';
  const name = (metadata.name as string) ?? ((user.email ?? 'User').split('@')[0] || 'User');
  const phone = (metadata.phone as string) ?? null;

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      role,
      name,
      phone,
    },
    { onConflict: 'id' },
  );
  if (error) throw error;
}

export async function fetchCurrentUserProfile() {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();
  if (authError) throw authError;
  const user = session?.user;
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    if ((error as { code?: string }).code === 'PGRST116') {
      await ensureProfile(user);
      const { data: retryProfile, error: retryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (retryError) throw retryError;
      return mapProfileToUser(retryProfile, user.email ?? '');
    }
    throw error;
  }
  return mapProfileToUser(profile, user.email ?? '');
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        role: input.role,
        phone: input.phone ?? null,
      },
    },
  });
  if (error) throw error;

  // If email confirmation is required, signUp can succeed without creating a
  // client session. In that case the DB trigger creates the profile row, and a
  // client-side upsert would fail against RLS despite the account being valid.
  if (!data.session?.user) {
    return null;
  }

  await ensureProfile({
    id: data.session.user.id,
    email: data.session.user.email,
    user_metadata: data.session.user.user_metadata as Record<string, unknown>,
  });

  return fetchCurrentUserProfile();
}

export async function loginUser(email: string, password: string, selectedRole: UserRole) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const profile = await fetchCurrentUserProfile();
  if (!profile) throw new Error('Profile not found for current user');
  if (profile.role !== selectedRole)
    throw new Error(`Account is ${profile.role}, not ${selectedRole}`);
  return profile;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function updateCurrentUserProfile(input: {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}) {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();
  if (authError) throw authError;
  const user = session?.user;
  if (!user) throw new Error('You must be signed in to update your profile');

  const payload = {
    name: input.name,
    phone: input.phone?.trim() || null,
    address: input.address?.trim() || null,
    city: input.city?.trim() || null,
    country: input.country?.trim() || 'USA',
  };

  const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
  if (error) throw error;

  const profile = await fetchCurrentUserProfile();
  if (!profile) throw new Error('Profile not found after update');
  return profile;
}

export async function fetchFoodCategories() {
  const { data, error } = await supabase.from('food_categories').select('*').order('name');
  if (error) throw error;
  return data;
}

export async function createDonation(input: {
  donorId: string;
  title: string;
  description: string;
  categoryId: string;
  quantity: number;
  unit: string;
  expiryAt: string;
  address: string;
  isUrgent: boolean;
  notes?: string;
  imagePaths: string[];
}) {
  const { data: donation, error } = await supabase
    .from('donations')
    .insert({
      donor_id: input.donorId,
      title: input.title,
      description: input.description,
      category_id: input.categoryId,
      quantity: input.quantity,
      unit: input.unit,
      expiry_at: input.expiryAt,
      address: input.address,
      is_urgent: input.isUrgent,
      notes: input.notes ?? null,
    })
    .select('*')
    .single();

  if (error) throw error;

  if (input.imagePaths.length > 0) {
    const { error: imageError } = await supabase.from('donation_images').insert(
      input.imagePaths.map((path) => ({
        donation_id: donation.id,
        path,
      })),
    );
    if (imageError) throw imageError;
  }

  return donation;
}

export async function uploadDonationImage(userId: string, file: File) {
  const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from('donation-images')
    .upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export async function fetchDonorDonations(donorId: string) {
  const { data, error } = await supabase
    .from('donations')
    .select(
      '*, donor:profiles!donations_donor_id_fkey(name), category:food_categories(*), donation_images(*)',
    )
    .eq('donor_id', donorId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data.map((row) => mapDonationRow(row));
}

export async function fetchAvailableDonations() {
  const { data, error } = await supabase
    .from('donations')
    .select(
      '*, donor:profiles!donations_donor_id_fkey(name), category:food_categories(*), donation_images(*)',
    )
    .eq('status', 'available')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((row) => mapDonationRow(row));
}

export async function requestDonation(donationId: string, recipientId: string) {
  const { error } = await supabase
    .from('food_requests')
    .insert({
      recipient_id: recipientId,
      quantity: 1,
      address: 'Pending location',
      notes: `Request for donation ${donationId}`,
    });
  if (error) throw error;
}

export async function fetchVolunteerDeliveries(volunteerId: string) {
  const { data, error } = await supabase
    .from('deliveries')
    .select(
      '*, donation:donations(*, category:food_categories(*), donor:profiles!donations_donor_id_fkey(name,phone,address)), recipient:profiles!deliveries_recipient_id_fkey(name,phone,address)',
    )
    .eq('volunteer_id', volunteerId)
    .in('status', ['assigned', 'picking_up', 'in_transit'])
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchAdminMetrics() {
  const [profiles, donations, deliveries, topDonors] = await Promise.all([
    supabase.from('profiles').select('id, role, name, created_at'),
    supabase.from('donations').select('id, title, status, donor_id, created_at'),
    supabase.from('deliveries').select('id, donation_id, volunteer_id, recipient_id, status, created_at'),
    supabase.from('donations').select('donor_id').limit(1000),
  ]);

  if (profiles.error) throw profiles.error;
  if (donations.error) throw donations.error;
  if (deliveries.error) throw deliveries.error;
  if (topDonors.error) throw topDonors.error;

  return {
    profiles: profiles.data,
    donations: donations.data,
    deliveries: deliveries.data,
    topDonors: topDonors.data,
  };
}

export async function fetchCommunityContent() {
  const [stories, tips, events] = await Promise.all([
    supabase
      .from('community_stories')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(6),
    supabase.from('community_tips').select('*').order('created_at', { ascending: false }),
    supabase.from('community_events').select('*').order('event_date', { ascending: true }).limit(6),
  ]);
  if (stories.error) throw stories.error;
  if (tips.error) throw tips.error;
  if (events.error) throw events.error;
  return { stories: stories.data, tips: tips.data, events: events.data };
}
