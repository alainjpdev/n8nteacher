import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 40;

export default function PropertyCarousel({ images }: { images: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < images.length) {
      setActiveIndex(index);
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        scrollEnabled
        nestedScrollEnabled
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.carouselImage} />
        )}
      />

      {/* Áreas táctiles invisibles */}
      <View style={styles.touchZones}>
        {/* Zona izquierda para ir atrás */}
        <Pressable style={styles.leftZone} onPress={() => goToSlide(activeIndex - 1)} />
        {/* Zona derecha para ir adelante */}
        <Pressable style={styles.rightZone} onPress={() => goToSlide(activeIndex + 1)} />
      </View>

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    carouselImage: {
        width: ITEM_WIDTH,
        height: Dimensions.get('window').height * 0.33,
        borderRadius: 8,
      },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  touchZones: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    flexDirection: 'row',
    zIndex: 1,
  },
  leftZone: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  rightZone: {
    flex: 3,
    backgroundColor: 'transparent',
  },
});