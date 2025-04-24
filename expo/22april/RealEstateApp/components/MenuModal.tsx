import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  'Buy', 'Rent', 'Sell', 'Home Loans',
  'Find an Agent', 'Manage Rentals',
  'Advertise', 'Help'
];

export default function MenuModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.modalBackground} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#007AFF" style={{ opacity: 0 }} /> 
            </Pressable>
            <Text style={styles.title}>MiCasApp</Text>
          </View>

          <FlatList
            data={menuItems}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable style={styles.menuItem}>
                <Text style={styles.menuText}>{item}</Text>
                <Ionicons name="chevron-down" size={16} color="#007AFF" />
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuText: {
    fontSize: 16,
  },
});