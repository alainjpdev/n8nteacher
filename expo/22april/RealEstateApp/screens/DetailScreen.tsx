import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { toggleFavorite } from '../utils/favorites';
import { supabase } from '../supabase';
import PropertyCarousel from '../components/PropertyCarousel';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
const { height } = Dimensions.get('window');

export default function DetailScreen({ route }: { route: DetailScreenRouteProp }) {
  const { property } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return;

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', property.uuid)
        .maybeSingle();

      setIsFavorite(!!data);
    };

    fetchFavoriteStatus();
  }, [property.uuid]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagen superior */}
        <View style={[styles.imageWrapper, { marginTop: 0, height: height * 0.7 }]}>
          <PropertyCarousel images={property.images} />

          {/* Botón de regresar */}
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>

          <View style={styles.topIcons}>
            <Pressable
              onPress={async () => {
                if (!property.uuid) return;
                const result = await toggleFavorite(property.uuid);
                if (result.success) {
                  setIsFavorite((prev) => !prev);
                } else {
                  navigation.navigate('Login');
                }
              }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color="#fff"
                style={styles.icon}
              />
            </Pressable>

            <Pressable onPress={() => console.log('Share')}>
              <Feather name="share" size={22} color="#fff" style={styles.icon} />
            </Pressable>
            <Pressable onPress={() => console.log('Close')}>
              <Ionicons name="close-circle-outline" size={22} color="#fff" style={styles.icon} />
            </Pressable>
            <Pressable onPress={() => console.log('More')}>
              <Ionicons name="ellipsis-horizontal" size={22} color="#fff" style={styles.icon} />
            </Pressable>
          </View>
        </View>

        {/* Detalles */}
        <View style={styles.detailsSection}>
          <Text style={styles.price}>${property.price.toLocaleString()}</Text>
          <Text style={styles.detailsText}>
            <Text style={styles.bold}>{property.bedrooms} beds</Text> ·{' '}
            <Text style={styles.bold}>{property.bathrooms} baths</Text> ·{' '}
            <Text style={styles.bold}>{property.sqft.toLocaleString()} sqft</Text>
          </Text>
          <Text style={styles.address}>{property.address}</Text>

          <Text style={styles.mortgage}>
            Est. <Text style={styles.mortgageBold}>$2,536/mo</Text>{' '}
            <Text style={styles.link}>Get pre-qualified</Text>
          </Text>

          <View style={styles.featureGrid}>
            <Feature icon="home-outline" label="Single Family Residence" />
            <Feature icon="calendar-outline" label="Built in ----" />
            <Feature icon="map-outline" label="22 Acres Lot" />
            <Feature icon="trending-up-outline" label="$-- Zestimate®" />
            <Feature
              icon="cash-outline"
              label={`$${Math.round(Number(property.price) / property.sqft)}/sqft`}
            />
            <Feature icon="leaf-outline" label="$-- HOA" />
          </View>
        </View>
      </ScrollView>

      {/* Botones fijos abajo */}
      <View style={styles.bottomButtons}>
        <Pressable style={styles.tourButton}>
          <Text style={styles.tourText}>Request a tour</Text>
          <Text style={styles.tourSub}>as early as today at 11:30 am</Text>
        </Pressable>
        <Pressable style={styles.agentButton}>
          <Text style={styles.agentText}>Contact agent</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Feature({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={18} color="#444" />
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 130 },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    padding: 10,
    zIndex: 20,
  },
  topIcons: {
    position: 'absolute',
    right: 10,
    top: 50,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  icon: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 20,
  },
  detailsSection: { padding: 20 },
  price: { fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  detailsText: { fontSize: 15, color: '#444', marginBottom: 4 },
  bold: { fontWeight: 'bold' },
  address: { fontSize: 14, color: '#555' },
  mortgage: { marginTop: 10, fontSize: 15, color: '#444' },
  mortgageBold: { fontWeight: 'bold' },
  link: { color: '#1e90ff', fontWeight: '500' },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 10,
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  featureText: { marginLeft: 8, fontSize: 14, color: '#333' },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    gap: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  tourButton: {
    flex: 1,
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 8,
  },
  tourText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  tourSub: { color: '#e0eaff', fontSize: 12, marginTop: 2 },
  agentButton: {
    flex: 1,
    borderColor: '#1e90ff',
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentText: { color: '#1e90ff', fontSize: 16, fontWeight: 'bold' },
});