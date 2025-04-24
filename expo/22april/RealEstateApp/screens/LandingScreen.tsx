import React, { useRef } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

export default function LandingScreen() {
  const videoRef = useRef<Video>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goToHome = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../assets/landing.mov')}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            goToHome();
          }
        }}
      />

      <Pressable style={styles.skipButton} onPress={goToHome}>
        <Text style={styles.skipText}>Saltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: { flex: 1 },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  skipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});