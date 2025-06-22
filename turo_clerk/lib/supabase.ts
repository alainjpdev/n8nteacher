import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'user' | 'host' | 'admin';
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'host' | 'admin';
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'host' | 'admin';
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      cars: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description: string;
          make: string;
          model: string;
          year: number;
          color: string;
          transmission: string;
          fuel_type: string;
          seats: number;
          price_per_day: number;
          images: string[];
          location: string;
          latitude: number;
          longitude: number;
          features: string[];
          is_available: boolean;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          description: string;
          make: string;
          model: string;
          year: number;
          color: string;
          transmission: string;
          fuel_type: string;
          seats: number;
          price_per_day: number;
          images: string[];
          location: string;
          latitude: number;
          longitude: number;
          features?: string[];
          is_available?: boolean;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string;
          title?: string;
          description?: string;
          make?: string;
          model?: string;
          year?: number;
          color?: string;
          transmission?: string;
          fuel_type?: string;
          seats?: number;
          price_per_day?: number;
          images?: string[];
          location?: string;
          latitude?: number;
          longitude?: number;
          features?: string[];
          is_available?: boolean;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          car_id: string;
          user_id: string;
          start_date: string;
          end_date: string;
          total_price: number;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status: 'pending' | 'paid' | 'refunded';
          payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          car_id: string;
          user_id: string;
          start_date: string;
          end_date: string;
          total_price: number;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status?: 'pending' | 'paid' | 'refunded';
          payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          car_id?: string;
          user_id?: string;
          start_date?: string;
          end_date?: string;
          total_price?: number;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status?: 'pending' | 'paid' | 'refunded';
          payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          reservation_id: string;
          reviewer_id: string;
          reviewed_id: string;
          rating: number;
          comment: string;
          type: 'car' | 'user';
          created_at: string;
        };
        Insert: {
          id?: string;
          reservation_id: string;
          reviewer_id: string;
          reviewed_id: string;
          rating: number;
          comment: string;
          type: 'car' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          reservation_id?: string;
          reviewer_id?: string;
          reviewed_id?: string;
          rating?: number;
          comment?: string;
          type?: 'car' | 'user';
          created_at?: string;
        };
      };
    };
  };
};