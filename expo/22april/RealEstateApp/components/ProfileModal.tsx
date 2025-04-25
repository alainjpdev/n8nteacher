import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: 'Home' | 'Login' | 'Landing' | 'Favourites') => void;
  onSignOut: () => void;
};

export default function ProfileModal({
  visible,
  onClose,
  onNavigate,
  onSignOut,
}: ProfileModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          <Text style={styles.title}>Mi Cuenta</Text>

          <Pressable
            style={styles.option}
            onPress={() => {
              onNavigate('Favourites');
              onClose();
            }}
          >
            <Text style={styles.optionText}>🏠 Favourite Homes</Text>
          </Pressable>

          <Pressable style={styles.option} onPress={() => onNavigate('Home')}>
            <Text style={styles.optionText}>⚙️ Account Settings</Text>
          </Pressable>

          <Pressable style={styles.option} onPress={onSignOut}>
            <Text style={[styles.optionText, { color: '#d00' }]}>🚪 Sign Out</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  option: {
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});