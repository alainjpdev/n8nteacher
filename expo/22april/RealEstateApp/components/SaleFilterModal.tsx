import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (selected: string) => void;
};

const options = ['For Sale', 'For Rent', 'Sold'];

export default function SaleFilterModal({ visible, onClose, onApply }: Props) {
  const [selected, setSelected] = useState('For Sale');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      {/* Touchable overlay to close */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Prevent close on inner press */}
        <Pressable style={styles.popup} onPress={() => {}}>
          {options.map((option) => (
            <Pressable
              key={option}
              style={styles.option}
              onPress={() => setSelected(option)}
            >
              <Ionicons
                name={selected === option ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={selected === option ? '#1E60FF' : '#999'}
              />
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}

          <Pressable
            style={styles.applyButton}
            onPress={() => {
              onApply(selected);
              onClose();
            }}
          >
            <Text style={styles.applyText}>Apply</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    width: 250,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  applyButton: {
    marginTop: 16,
    backgroundColor: '#1E60FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: '600',
  },
});