export type Listing = {
    id: string;
    uuid?: string;
    title: string;
    price: number;
    images: string[];
    description: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    address: string;
    agency: string;
    for_sale?: boolean;
    for_rent?: boolean;
    homeType: 'Houses' | 'Townhomes' | 'Multi-Family' | 'Condos/Co-ops' | 'Lots/Land' | 'Apartments';
  };