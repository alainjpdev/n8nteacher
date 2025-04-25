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
  homeType: 'House' | 'Townhomes' | 'Multi-Family' | 'Condos/Co-ops' | 'Lots/Land' | 'Apartment';
};

export type RootStackParamList = {
  Landing: undefined;
  Home: undefined;
  Details: { property: Listing };
  Map: undefined;
  Login: undefined;
  Favourites: undefined;
};
