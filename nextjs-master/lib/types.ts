export interface Listing {
    latitude: any;
    id: string;
    title: string;
    address?: string | null; 
    price: number;
    description?: string;
    type?: string | null; 
    bedrooms?: number | null;
    bathrooms?: number | null;
    sqft?: number | null;
    year_built?: number;
    features?: any;
    status?: string;
    latitud?: number;
    longitude?: number;
    images: string[]; // o string[], si guardas varias imágenes
    created_at?: string;
    updated_at?: string;
    user_id?: string;
    city?: string;
    state?: string;
    country?: string;
    
  }