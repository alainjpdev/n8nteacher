import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { supabase } from './supabase';
import { Listing } from './types';

import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import MapScreen from './screens/MapScreen';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import FavouritesScreen from './screens/FavouritesScreen';




export type RootStackParamList = {
  Landing: undefined;
  Home: undefined;
  Details: { property: Listing };
  Map: undefined;
  Login: undefined;
  Favourites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    setIsLoggedIn(!!data.session);
  };
  checkSession();

  // Listener para cambios de sesión
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setIsLoggedIn(!!session);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setInitialRoute('Home');
      } else {
        setInitialRoute('Landing');
      }
    };
    checkSession();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E60FF" />
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Favourites"
          component={FavouritesScreen}
          options={{ headerShown: true, title: 'Favourites' }}
        />
          
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: true, title: 'Sign In' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}