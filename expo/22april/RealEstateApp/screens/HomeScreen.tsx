import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Listing } from '../types';
import { getProperties } from '../supabase/properties';
import TopBar from '../components/TopBar';
import SubMenu from '../components/SubMenu';
import MenuModal from '../components/MenuModal';
import PropertyCarousel from '../components/PropertyCarousel';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [filterType, setFilterType] = useState<'sale' | 'rent'>('sale');

  const [filters, setFilters] = useState({
    min: null,
    max: null,
    bedrooms: 'Any',
    bathrooms: 'Any',
    homeTypes: ['Apartment'], // ✅ Corregido: debe coincidir con los valores exactos en Supabase
  });

  useEffect(() => {
    getProperties(filterType).then((data) => {
      if (data) {
        const filtered = data.filter((item) => {
          const price = Number(item.price);
          const matchesType = filterType === 'sale' ? item.for_sale : item.for_rent;
          const matchesMin = filters.min === null || price >= filters.min;
          const matchesMax = filters.max === null || price <= filters.max;
  
          const bedNum = parseInt(filters.bedrooms);
          const matchesBeds =
            filters.bedrooms === 'Any' || (!isNaN(bedNum) && item.bedrooms <= bedNum);
  
          const bathNum = parseInt(filters.bathrooms);
          const matchesBaths =
            filters.bathrooms === 'Any' || (!isNaN(bathNum) && item.bathrooms <= bathNum);
  
          const matchesHomeType =
            filters.homeTypes.length === 0 || filters.homeTypes.includes(item.homeType);
  
          return (
            matchesType &&
            matchesMin &&
            matchesMax &&
            matchesBeds &&
            matchesBaths &&
            matchesHomeType
          );
        });
  
        console.log('Filtered results:', filtered);
        setListings(filtered);
      }
    });
  }, [filterType, filters]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          height: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
          backgroundColor: 'white',
        }}
      />

      <TopBar
        onMenuPress={() => setMenuVisible(true)}
        onProfilePress={() => console.log('Profile page')}
      />

      <SubMenu
        filterType={filterType}
        onChangeFilter={setFilterType}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
      />

      <FlatList
        data={listings}
        keyExtractor={(item, index) => item.uuid ?? index.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Details', { property: item })}>
            <View style={styles.card}>
              <View style={styles.imageWrapper}>
                <PropertyCarousel images={item.images} />
                <Pressable style={styles.favoriteButton} onPress={() => console.log('Favorito')}>
                  <Ionicons name="heart-outline" size={24} color="#fff" />
                </Pressable>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.price}>${item.price.toLocaleString()}</Text>
                <Text style={styles.details}>
                  <Text style={styles.bold}>{item.bedrooms} bds</Text> |{' '}
                  <Text style={styles.bold}>{item.bathrooms} ba</Text> |{' '}
                  <Text style={styles.bold}>{item.sqft.toLocaleString()}</Text> sqft - {item.homeType}
                </Text>
                <Text style={styles.address}>{item.address}</Text>
                <Text style={styles.agency}>{item.agency}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />

      <Pressable style={styles.floatingButton} onPress={() => navigation.navigate('Map')}>
        <Ionicons name="map" size={20} color="#003366" />
        <Text style={styles.floatingText}>Map</Text>
      </Pressable>

      <MenuModal visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  imageWrapper: {
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },
  infoSection: {
    marginTop: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#444',
  },
  agency: {
    fontSize: 13,
    color: '#1E90FF',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#e6f0ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  floatingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#003366',
    fontWeight: '500',
  },
});