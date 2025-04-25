import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Listing } from '../types';
import PropertyCarousel from '../components/PropertyCarousel';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';

export default function FavouritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [favourites, setFavourites] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      console.log('Fetching favourites...');
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return;

      console.log('User ID:', user.id);

      const { data: favoriteRows, error: favoritesError } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError.message);
        return;
      }

      const propertyIds = favoriteRows?.map((fav) => fav.property_id) ?? [];
      console.log('Favorite property IDs:', propertyIds);

      if (propertyIds.length > 0) {
        const { data: properties, error: propertiesError } = await supabase
          .from('listings')
          .select('uuid, title, price, address, agency, images, bedrooms, bathrooms, sqft, homeType')
          .in('uuid', propertyIds);

        if (propertiesError) {
          console.error('Error fetching properties:', propertiesError.message);
          return;
        }

        console.log('Fetched properties:', properties);

        const parsedProperties = (properties || []).map((item) => ({
          ...item,
          images: Array.isArray(item.images)
            ? item.images
            : typeof item.images === 'string'
            ? item.images.replace(/[{}]/g, '').split(',')  // 🔥 Arreglamos el formato
            : [],
        }));

        setFavourites(parsedProperties as Listing[]);
      } else {
        setFavourites([]);
      }
    };

    fetchFavourites();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Favourite Homes</Text>

      <FlatList
        data={favourites}
        keyExtractor={(item, index) => item.uuid ?? index.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Details', { property: item })}>
            <View style={styles.card}>
              <PropertyCarousel images={item.images} />
              <Text style={styles.price}>${item.price.toLocaleString()}</Text>
              <Text style={styles.address}>{item.address}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>You haven’t saved any homes yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  address: {
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
});