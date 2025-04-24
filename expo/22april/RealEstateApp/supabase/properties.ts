import { supabase } from '../supabase';
import { Listing } from '../types';

export async function getProperties(type: 'sale' | 'rent'): Promise<Listing[]> {
  const column = type === 'sale' ? 'for_sale' : 'for_rent';

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq(column, true);

  if (error) {
    console.error('Error al obtener propiedades:', error.message);
    return [];
  }

  return data.map((item: any) => ({
    ...item,
    images: item.images
      ? item.images.replace(/[{}]/g, '').split(',').map((url: string) => url.trim())
      : [],
  }));
}