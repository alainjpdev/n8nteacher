import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Obtener todas las propiedades ordenadas por fecha
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('listings') // ahora sí en la tabla correcta
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase Error (getProperties):', error.message);
    return [];
  }

  return data || [];
};

// Obtener una propiedad por ID
export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase Error (getPropertyById):', error.message);
    return null;
  }

  return data;
};

// Agregar o eliminar de favoritos
export const toggleFavorite = async (propertyId: string) => {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    throw new Error('User must be logged in to favorite properties');
  }

  const { data: existingFavorite } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .maybeSingle();

  if (existingFavorite) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existingFavorite.id);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, property_id: propertyId });

    if (error) throw error;
    return true;
  }
};

// Enviar una solicitud de contacto
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
    .insert({
      property_id: inquiry.propertyId,
      user_id: user?.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
    });

  if (error) {
    console.error('Supabase Error (submitInquiry):', error.message);
    throw error;
  }

  return true;
};