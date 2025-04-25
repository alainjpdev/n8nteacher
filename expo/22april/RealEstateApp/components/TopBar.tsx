import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import ProfileModal from './ProfileModal';

type TopBarProps = {
  onMenuPress: () => void;
  onProfilePress?: () => void;
  isLoggedIn: boolean;
};

export default function TopBar({ onMenuPress, isLoggedIn }: TopBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [profileVisible, setProfileVisible] = useState(false);

  const handleSignOut = async () => {
    setProfileVisible(false);
    // Aquí iría tu lógica para cerrar sesión con Supabase, por ejemplo:
    // await supabase.auth.signOut();
    navigation.navigate('Landing');
  };

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={onMenuPress} style={styles.iconButton}>
          <Ionicons name="menu" size={28} color="#333" />
        </Pressable>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nevada MO 64772 homes"
            placeholderTextColor="#666"
          />
          <Ionicons name="search" size={20} color="#333" style={styles.searchIcon} />
        </View>

        {isLoggedIn ? (
          <Pressable onPress={() => setProfileVisible(true)} style={styles.avatar}>
            <Image source={require('../assets/avatar.png')} style={styles.avatarImage} />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={styles.signInButton}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </Pressable>
        )}
      </View>

      <ProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        onNavigate={(screen) => navigation.navigate(screen)}
        onSignOut={handleSignOut}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginLeft: 4,
  },
  avatar: {
    padding: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  signInButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E60FF',
    backgroundColor: '#fff',
  },
  signInText: {
    color: '#1E60FF',
    fontWeight: '600',
    fontSize: 14,
  },
});