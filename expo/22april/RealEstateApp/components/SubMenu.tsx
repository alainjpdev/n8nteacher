import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import SaleFilterModal from './SaleFilterModal';
import PriceFilterModal from './PriceFilterModal';

export default function SubMenu({
  filterType,
  onChangeFilter,
  onChangePrice,
}: {
  filterType: 'sale' | 'rent';
  onChangeFilter: (value: 'sale' | 'rent') => void;
  onChangePrice: (min: number | null, max: number | null) => void;
}) {
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(
    filterType === 'sale' ? 'For Sale' : 'For Rent'
  );
  const [selectedPrice, setSelectedPrice] = useState('Price');

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftGroup}>
          <Pressable
            style={styles.filterButton}
            onPress={() => setSaleModalVisible(true)}
          >
            <Text style={styles.buttonText}>{selectedStatus}</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </Pressable>

          <Pressable
            style={styles.filterButton}
            onPress={() => setPriceModalVisible(true)}
          >
            <Text style={styles.buttonText}>{selectedPrice}</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </Pressable>

          <Pressable style={styles.filterButton}>
            <Text style={styles.buttonText}>More</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </Pressable>
        </View>

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save search</Text>
        </Pressable>
      </View>

      {/* For Sale Filter */}
      <SaleFilterModal
        visible={saleModalVisible}
        onClose={() => setSaleModalVisible(false)}
        onApply={(value) => {
          setSelectedStatus(value);
          onChangeFilter(value === 'For Sale' ? 'sale' : 'rent');
        }}
      />

      {/* Price Filter */}
      <PriceFilterModal
        visible={priceModalVisible}
        onClose={() => setPriceModalVisible(false)}
        onApply={(min, max) => {
          if (min === 'No Min' && max === 'No Max') {
            setSelectedPrice('Price');
            onChangePrice(null, null);
          } else {
            const minVal = min === 'No Min' ? null : parseInt(min);
            const maxVal = max === 'No Max' ? null : parseInt(max);
            setSelectedPrice(`${min} - ${max}`);
            onChangePrice(minVal, maxVal);
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '500',
    marginRight: 4,
  },
  saveButton: {
    backgroundColor: '#1E60FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
