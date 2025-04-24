export type Listing = {
    uuid?: string; 
    id: string;
    title: string;
    price: string;
    images: string[];
    description: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    address: string;
    agency: string;
    for_sale:boolean;
    for_rent:boolean;
  };