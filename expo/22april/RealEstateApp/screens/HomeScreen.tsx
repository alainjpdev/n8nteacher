import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Dimensions } from 'react-native';
import { listings } from '../data/listings';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import TopBar from '../components/TopBar';
import SubMenu from '../components/SubMenu';
import MenuModal from '../components/MenuModal';
import PropertyCarousel from '../components/PropertyCarousel';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        onMenuPress={() => setMenuVisible(true)}
        onProfilePress={() => console.log('Profile page')}
      />

      <SubMenu />

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
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
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.details}>
                  <Text style={styles.bold}>{item.bedrooms} bds</Text> |{' '}
                  <Text style={styles.bold}>{item.bathrooms} ba</Text> |{' '}
                  <Text style={styles.bold}>{item.sqft.toLocaleString()}</Text> sqft - House for sale
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