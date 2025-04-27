export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          address: string
          price: number
          description: string | null
          type: string
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          year_built: number | null
          features: Json | null
          status: string | null
          lat: number | null
          lng: number | null
          images: Json | null
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          title: string
          address: string
          price: number
          description?: string | null
          type: string
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          year_built?: number | null
          features?: Json | null
          status?: string | null
          lat?: number | null
          lng?: number | null
          images?: Json | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          address?: string
          price?: number
          description?: string | null
          type?: string
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          year_built?: number | null
          features?: Json | null
          status?: string | null
          lat?: number | null
          lng?: number | null
          images?: Json | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          user_id: string | null
          property_id: string
          name: string
          email: string
          phone: string | null
          message: string
          created_at: string
          read: boolean | null
          responded: boolean | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          property_id: string
          name: string
          email: string
          phone?: string | null
          message: string
          created_at?: string
          read?: boolean | null
          responded?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string | null
          property_id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          created_at?: string
          read?: boolean | null
          responded?: boolean | null
        }
      }
    }
  }
}