import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import { parseImages } from '@/lib/parse-images'; // ✅ asegúrate de importar esto

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/* ────────────────────────────────────────────────
   1️⃣  Obtener TODAS las propiedades (listings)
────────────────────────────────────────────────── */
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      id,
      title,
      price,
      homeType,
      type,
      images,
      latitude,
      longitude,
      address,
      bedrooms,
      bathrooms,
      sqft,
      description,
      year_built,
      city,
      state,
      country
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase Error (getProperties):', error.message);
    return [];
  }

  return data ?? [];
};

/* ────────────────────────────────────────────────
   2️⃣  Obtener UNA propiedad (listing)
────────────────────────────────────────────────── */
export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      id,
      title,
      description,
      price,
      homeType,
      type,
      images,
      latitude,
      longitude,
      address,
      bedrooms,
      bathrooms,
      sqft,
      year_built,
      city,
      state,
      country
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase Error (getPropertyById):', error.message);
    return null;
  }

  if (!data) {
    console.error('Supabase Error (getPropertyById): no data');
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    address: data.address,
    price: data.price,
    type: data.type || "sale",
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    sqft: data.sqft,
    images: parseImages(data.images), // ✅ usar parseImages
    description: data.description,
    year_built: data.year_built,
    city: data.city,
    state: data.state,
    country: data.country,
  };
};

/* ────────────────────────────────────────────────
   3️⃣  Alternar favorito (guardar o eliminar)
────────────────────────────────────────────────── */
export const toggleFavorite = async (propertyId: string) => {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    throw new Error('redirect');
  }

  const { data: existingFavorite, error: selectError } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .maybeSingle();

  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error checking favorite:', selectError);
    throw selectError;
  }

  if (existingFavorite?.id) {
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existingFavorite.id);

    if (deleteError) throw deleteError;
    return false;
  } else {
    const { error: insertError } = await supabase
      .from('favorites')
      .insert([{ user_id: user.id, property_id: propertyId }]);

    if (insertError) throw insertError;
    return true;
  }
};

/* ────────────────────────────────────────────────
   4️⃣  Obtener IDs de propiedades favoritas
────────────────────────────────────────────────── */
export const getFavoritePropertyIds = async () => {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    return [];
  }

  const { data: favorites, error } = await supabase
    .from('favorites')
    .select('property_id')
    .eq('user_id', user.id);

  if (error) {
    console.error('Supabase Error (getFavoritePropertyIds):', error.message);
    return [];
  }

  return favorites?.map((fav) => fav.property_id) || [];
};

/* ────────────────────────────────────────────────
   5️⃣  Enviar formulario de contacto
────────────────────────────────────────────────── */
export const submitInquiry = async (inquiry: {
  propertyId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const { error } = await supabase
    .from('inquiries')
    .insert([{
      property_id: inquiry.propertyId,
      user_id: user?.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
    }]);

  if (error) {
    console.error('Supabase Error (submitInquiry):', error.message);
    throw error;
  }

  return true;
};