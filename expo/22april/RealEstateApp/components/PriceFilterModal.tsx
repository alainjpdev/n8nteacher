import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (min: string, max: string) => void;
};

const priceOptions = ['No Min', '$100k', '$200k', '$300k'];
const maxOptions = ['No Max', '$400k', '$500k', '$600k'];

export default function PriceFilterModal({ visible, onClose, onApply }: Props) {
  const [activeTab, setActiveTab] = useState<'list' | 'monthly'>('list');
  const [min, setMin] = useState('No Min');
  const [max, setMax] = useState('No Max');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.popup} onPress={() => {}}>
          <Text style={styles.header}>Price Range</Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, activeTab === 'list' && styles.activeTab]}
              onPress={() => setActiveTab('list')}
            >
              <Text style={activeTab === 'list' ? styles.activeTabText : styles.tabText}>List Price</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
              onPress={() => setActiveTab('monthly')}
            >
              <Text style={activeTab === 'monthly' ? styles.activeTabText : styles.tabText}>Monthly Payment</Text>
            </Pressable>
          </View>

          {/* Min / Max Selectors */}
          <View style={styles.priceRow}>
            <View style={styles.priceBox}>
              <Text style={styles.label}>Minimum</Text>
              <Text style={styles.dropdown}>{min} ⌄</Text>
            </View>
            <Text style={{ fontSize: 18, marginTop: 28 }}>–</Text>
            <View style={styles.priceBox}>
              <Text style={styles.label}>Maximum</Text>
              <Text style={styles.dropdown}>{max} ⌄</Text>
            </View>
          </View>

          {/* BuyAbility */}
          <Pressable style={styles.buyAbility}>
            <Ionicons name="calculator-outline" size={16} color="#1E60FF" />
            <Text style={styles.buyText}>Calculate your BuyAbility℠</Text>
          </Pressable>

          {/* Apply Button */}
          <Pressable
            style={styles.applyButton}
            onPress={() => {
              onApply(min, max);
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
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderColor: '#1E60FF',
    borderBottomWidth: 2,
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: '#1E60FF',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    color: '#333',
  },
  buyAbility: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  buyText: {
    marginLeft: 6,
    color: '#1E60FF',
    fontWeight: '500',
  },
  applyButton: {
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