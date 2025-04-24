import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (min: number | null, max: number | null) => void;
};

const priceOptions = ['No Min', '$100k', '$200k', '$300k'];
const maxOptions = ['No Max', '$200k', '$500k', '$600k'];

export default function PriceFilterModal({ visible, onClose, onApply }: Props) {
  const [min, setMin] = useState('No Min');
  const [max, setMax] = useState('No Max');

  const parsePrice = (val: string): number | null => {
    if (val === 'No Min' || val === 'No Max') return null;
    return parseInt(val.replace(/\D/g, '')) * 1000;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.popup} onPress={() => {}}>
          <Text style={styles.header}>Price Range</Text>

          <View style={styles.priceRow}>
            <View style={styles.priceBox}>
              <Text style={styles.label}>Minimum</Text>
              {priceOptions.map((option) => (
                <Pressable key={option} onPress={() => setMin(option)}>
                  <Text style={[styles.dropdown, min === option && { fontWeight: 'bold' }]}>{option}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={{ fontSize: 18, marginTop: 28 }}>–</Text>

            <View style={styles.priceBox}>
              <Text style={styles.label}>Maximum</Text>
              {maxOptions.map((option) => (
                <Pressable key={option} onPress={() => setMax(option)}>
                  <Text style={[styles.dropdown, max === option && { fontWeight: 'bold' }]}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            style={styles.applyButton}
            onPress={() => {
              onApply(parsePrice(min), parsePrice(max));
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
    width: 300,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceBox: {
    width: '40%',
  },
  label: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
    marginBottom: 6,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#1E60FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  applyText: {
    color: '#fff',
    fontWeight: '600',
  },
});