export interface Listing {
    id: string;
    title: string;
    address: string;
    price: number;
    description?: string;
    type: "sale" | "rent";
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    year_built?: number;
    features?: any;
    status?: string;
    lat?: number;
    lng?: number;
    images: string[]; // o string[], si guardas varias imágenes
    created_at?: string;
    updated_at?: string;
    user_id?: string;
  }