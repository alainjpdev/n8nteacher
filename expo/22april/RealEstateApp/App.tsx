import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import MapScreen from './screens/MapScreen';
import LandingScreen from './screens/LandingScreen';
import { Listing } from './types';
import { enableScreens } from 'react-native-screens';

enableScreens(false);

export type RootStackParamList = {
  Landing: undefined;
  Home: undefined;
  Details: { property: Listing };
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false, contentStyle: { paddingTop: 0 } }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false, contentStyle: { paddingTop: 0 } }}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen}
            options={{ headerShown: false, contentStyle: { paddingTop: 0 } }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ headerShown: false, contentStyle: { paddingTop: 0 } }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}