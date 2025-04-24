import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import SaleFilterModal from './SaleFilterModal';
import FilterModal from './FilterModal';

export default function SubMenu({
  filterType,
  onChangeFilter,
  onApplyFilters,
}: {
  filterType: 'sale' | 'rent';
  onChangeFilter: (value: 'sale' | 'rent') => void;
  onApplyFilters: (filters: {
    min: number | null;
    max: number | null;
    bedrooms: string;
    bathrooms: string;
    homeTypes: string[];
  }) => void;
}) {
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(
    filterType === 'sale' ? 'For Sale' : 'For Rent'
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftGroup}>
          <Pressable style={styles.filterButton} onPress={() => setSaleModalVisible(true)}>
            <Text style={styles.buttonText}>{selectedStatus}</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </Pressable>

          <Pressable style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <Text style={styles.buttonText}>Filters</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </Pressable>
        </View>

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save search</Text>
        </Pressable>
      </View>

      {/* Sale / Rent Modal */}
      <SaleFilterModal
        visible={saleModalVisible}
        onClose={() => setSaleModalVisible(false)}
        onApply={(value) => {
          setSelectedStatus(value);
          onChangeFilter(value === 'For Sale' ? 'sale' : 'rent');
        }}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={(filters) => {
          onApplyFilters(filters);
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
