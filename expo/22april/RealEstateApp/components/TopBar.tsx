import { View, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TopBarProps = {
  onMenuPress: () => void;
  onProfilePress: () => void;
};

export default function TopBar({ onMenuPress, onProfilePress }: TopBarProps) {
  return (
    <View style={styles.container}>
      {/* Menú hamburguesa */}
      <Pressable onPress={onMenuPress} style={styles.iconButton}>
        <Ionicons name="menu" size={28} color="#333" />
      </Pressable>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nevada MO 64772 homes"
          placeholderTextColor="#666"
        />
        <Ionicons name="search" size={20} color="#333" style={styles.searchIcon} />
      </View>

      {/* Avatar / Perfil */}
      <Pressable onPress={onProfilePress} style={styles.avatar}>
        <Image
          source={require('../assets/avatar.png')}
          style={styles.avatarImage}
        />
      </Pressable>
    </View>
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
});