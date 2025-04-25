import React from 'react';
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Adaptación de MapView y Marker según la plataforma
let MapView: any, Marker: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
} else {
  // Para Web, usar un placeholder o un iframe opcional
  MapView = ({ children, style }: any) => (
    <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 16, color: '#888' }}>🗺️ Map not supported on web</Text>
      {children}
    </View>
  );
  Marker = () => null;
}

export default function MapScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 21.1667, // Puerto Cancún
          longitude: -86.8122,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 21.1667, longitude: -86.8122 }}
          title="Puerto Cancún"
          description="Luxury beachfront properties"
        />
      </MapView>

      {/* Botón flotante para regresar a la lista */}
      <Pressable style={styles.floatingButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={20} color="#003366" />
        <Text style={styles.floatingText}>List</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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