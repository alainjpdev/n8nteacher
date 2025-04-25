import { supabase } from '../supabase';

export async function toggleFavorite(propertyId: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
  
    if (!user) {
      return { success: false, message: 'Not logged in' };
    }
  
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single();
  
    if (existing) {
      // If already exists, delete it
      await supabase.from('favorites').delete().eq('id', existing.id);
      return { success: true, action: 'removed' };
    } else {
      // Otherwise, insert
      await supabase.from('favorites').insert([
        { user_id: user.id, property_id: propertyId },
      ]);
      return { success: true, action: 'added' };
    }
  }