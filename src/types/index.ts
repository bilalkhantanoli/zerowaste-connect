export type UserRole = 'donor' | 'recipient' | 'volunteer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: Location;
  rating: number;
  verified: boolean;
  createdAt: Date;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  title: string;
  description: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  expiryDate: Date;
  images: string[];
  location: Location;
  status: 'available' | 'reserved' | 'matched' | 'in_transit' | 'delivered' | 'expired';
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodRequest {
  id: string;
  recipientId: string;
  recipientName: string;
  categories: FoodCategory[];
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  notes?: string;
  location: Location;
  status: 'pending' | 'matched' | 'fulfilled' | 'cancelled';
  createdAt: Date;
}

export interface Match {
  id: string;
  donationId: string;
  requestId: string;
  donorId: string;
  recipientId: string;
  volunteerId?: string;
  score: number;
  status: 'pending' | 'accepted' | 'in_transit' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Delivery {
  id: string;
  matchId: string;
  volunteerId: string;
  volunteerName: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  status: 'assigned' | 'picking_up' | 'in_transit' | 'delivered' | 'failed';
  pickupTime?: Date;
  deliveryTime?: Date;
  proofImage?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'donation' | 'request' | 'match' | 'delivery' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface ImpactStats {
  mealsSaved: number;
  kgFoodSaved: number;
  co2Reduced: number;
  deliveriesCompleted: number;
  activeVolunteers: number;
  totalDonors: number;
  totalRecipients: number;
}
