import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

const priceOptions = ['No Min', '$100k', '$200k', '$300k', '$400k', '$500k'];
const maxOptions = ['No Max', '$200k', '$300k', '$400k', '$500k', '$600k'];
const bedroomOptions = ['Any', '1', '2', '3', '4+'];
const bathroomOptions = ['Any', '1', '2', '3', '4+'];
const homeTypesOptions = [
  'Apartment',
  'House',
  'Townhome',
  'Multi-Family',
  'Condo/Co-op',
  'Lot/Land',
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    min: number | null;
    max: number | null;
    bedrooms: string;
    bathrooms: string;
    homeTypes: string[];
  }) => void;
};

export default function FilterModal({ visible, onClose, onApply }: Props) {
  const [min, setMin] = useState<string>('No Min');
  const [max, setMax] = useState<string>('No Max');
  const [bedrooms, setBedrooms] = useState<string>('Any');
  const [bathrooms, setBathrooms] = useState<string>('Any');
  const [homeTypes, setHomeTypes] = useState<string[]>([...homeTypesOptions]);

  const parseValue = (val: string): number | null =>
    val === 'No Min' || val === 'No Max' ? null : parseInt(val.replace('$', '').replace('k', '')) * 1000;

  const toggleHomeType = (type: string) => {
    setHomeTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleReset = () => {
    setMin('No Min');
    setMax('No Max');
    setBedrooms('Any');
    setBathrooms('Any');
    setHomeTypes([...homeTypesOptions]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>Filter Properties</Text>

            <Text style={styles.sectionLabel}>Minimum Price</Text>
            <View style={styles.optionsRow}>
              {priceOptions.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setMin(opt)}
                  style={[styles.option, min === opt && styles.selected]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Maximum Price</Text>
            <View style={styles.optionsRow}>
              {maxOptions.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setMax(opt)}
                  style={[styles.option, max === opt && styles.selected]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Bedrooms</Text>
            <View style={styles.optionsRow}>
              {bedroomOptions.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setBedrooms(opt)}
                  style={[styles.option, bedrooms === opt && styles.selected]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Bathrooms</Text>
            <View style={styles.optionsRow}>
              {bathroomOptions.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setBathrooms(opt)}
                  style={[styles.option, bathrooms === opt && styles.selected]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Home Type</Text>
            <View style={styles.optionsWrap}>
              {homeTypesOptions.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => toggleHomeType(type)}
                  style={[styles.option, homeTypes.includes(type) && styles.selected]}
                >
                  <Text style={styles.optionText}>{type}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable onPress={handleReset}>
              <Text style={styles.reset}>Reset all filters</Text>
            </Pressable>
            <Pressable
              style={styles.applyButton}
              onPress={() => {
                onApply({
                  min: parseValue(min),
                  max: parseValue(max),
                  bedrooms,
                  bathrooms,
                  homeTypes,
                });
                onClose();
              }}
            >
              <Text style={styles.applyText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    marginVertical: 10,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginRight: 8,
    marginTop: 4,
  },
  selected: {
    backgroundColor: '#1E60FF',
    borderColor: '#1E60FF',
  },
  optionText: {
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  reset: {
    color: '#999',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#1E60FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  applyText: {
    color: '#fff',
    fontWeight: '600',
  },
});
