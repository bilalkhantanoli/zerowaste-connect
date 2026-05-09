export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'donor' | 'recipient' | 'volunteer' | 'admin';
          name: string;
          phone: string | null;
          avatar_url: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          lat: number | null;
          lng: number | null;
          rating: number;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: 'donor' | 'recipient' | 'volunteer' | 'admin';
          name: string;
          phone?: string | null;
          avatar_url?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          lat?: number | null;
          lng?: number | null;
          rating?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      food_categories: {
        Row: { id: string; name: string; icon: string; created_at: string };
        Insert: { id?: string; name: string; icon: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['food_categories']['Insert']>;
      };
      donations: {
        Row: {
          id: string;
          donor_id: string;
          title: string;
          description: string;
          category_id: string;
          quantity: number;
          unit: string;
          expiry_at: string;
          address: string;
          city: string;
          country: string;
          lat: number | null;
          lng: number | null;
          status: 'available' | 'reserved' | 'matched' | 'in_transit' | 'delivered' | 'expired';
          is_urgent: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_id: string;
          title: string;
          description: string;
          category_id: string;
          quantity: number;
          unit: string;
          expiry_at: string;
          address: string;
          city?: string;
          country?: string;
          lat?: number | null;
          lng?: number | null;
          status?: 'available' | 'reserved' | 'matched' | 'in_transit' | 'delivered' | 'expired';
          is_urgent?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['donations']['Insert']>;
      };
      donation_images: {
        Row: { id: string; donation_id: string; path: string; created_at: string };
        Insert: { id?: string; donation_id: string; path: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['donation_images']['Insert']>;
      };
      food_requests: {
        Row: {
          id: string;
          recipient_id: string;
          quantity: number;
          urgency: 'low' | 'medium' | 'high';
          notes: string | null;
          address: string;
          city: string;
          country: string;
          lat: number | null;
          lng: number | null;
          status: 'pending' | 'matched' | 'fulfilled' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          quantity: number;
          urgency?: 'low' | 'medium' | 'high';
          notes?: string | null;
          address: string;
          city?: string;
          country?: string;
          lat?: number | null;
          lng?: number | null;
          status?: 'pending' | 'matched' | 'fulfilled' | 'cancelled';
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['food_requests']['Insert']>;
      };
      deliveries: {
        Row: {
          id: string;
          donation_id: string;
          volunteer_id: string;
          recipient_id: string;
          status: 'assigned' | 'picking_up' | 'in_transit' | 'delivered' | 'failed';
          pickup_time: string | null;
          delivery_time: string | null;
          proof_image_path: string | null;
          notes: string | null;
          estimated_minutes: number | null;
          distance_km: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donation_id: string;
          volunteer_id: string;
          recipient_id: string;
          status?: 'assigned' | 'picking_up' | 'in_transit' | 'delivered' | 'failed';
          pickup_time?: string | null;
          delivery_time?: string | null;
          proof_image_path?: string | null;
          notes?: string | null;
          estimated_minutes?: number | null;
          distance_km?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['deliveries']['Insert']>;
      };
      community_stories: {
        Row: {
          id: string;
          title: string;
          excerpt: string;
          image_url: string | null;
          author: string;
          role: string;
          category: string;
          likes: number;
          comments_count: number;
          published_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt: string;
          image_url?: string | null;
          author: string;
          role: string;
          category: string;
          likes?: number;
          comments_count?: number;
          published_at?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['community_stories']['Insert']>;
      };
      community_tips: {
        Row: { id: string; icon: string; title: string; description: string; created_at: string };
        Insert: {
          id?: string;
          icon: string;
          title: string;
          description: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['community_tips']['Insert']>;
      };
      community_events: {
        Row: {
          id: string;
          title: string;
          event_date: string;
          location: string;
          attendees: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          event_date: string;
          location: string;
          attendees?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['community_events']['Insert']>;
      };
    };
  };
};
