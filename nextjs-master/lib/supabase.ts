import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/database.types';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ✅ Get all properties
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase Error (getProperties):', error.message);
    return [];
  }

  return data || [];
};

// ✅ Get a single property by ID
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

// ✅ Toggle favorite: clean and correct
export const toggleFavorite = async (propertyId: string) => {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    throw new Error("redirect"); // Redirect if user not logged in
  }

  // Check if already favorited
  const { data: existingFavorite, error: selectError } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .maybeSingle();

  if (selectError && selectError.code !== "PGRST116") {
    console.error('Error checking favorite:', selectError);
    throw selectError;
  }

  if (existingFavorite?.id) {
    // If exists, remove favorite
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existingFavorite.id);

    if (deleteError) throw deleteError;
    return false; // Unfavorited
  } else {
    // If not exists, add new favorite
    const { error: insertError } = await supabase
      .from('favorites')
      .insert([{ user_id: user.id, property_id: propertyId }]); // ✅ INSERT ARRAY

    if (insertError) throw insertError;
    return true; // Favorited
  }
};

// ✅ Get favorite property IDs for current user
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

  return favorites.map((fav) => fav.property_id) || [];
};

// ✅ Submit inquiry form
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
    }]); // ✅ INSERT ARRAY also here!

  if (error) {
    console.error('Supabase Error (submitInquiry):', error.message);
    throw error;
  }

  return true;
};