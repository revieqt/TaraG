import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type CarouselProps = {
  images: string[];
  titles?: string[];
  subtitles?: string[];
  buttonLabels?: string[];
  buttonLinks?: (() => void)[];
  darkenImage?: boolean;
  style?: any;
  navigationArrows?: boolean;
};

const Carousel: React.FC<CarouselProps> = ({
  images,
  titles = [],
  subtitles = [],
  buttonLabels = [],
  buttonLinks = [],
  darkenImage = false,
  style,
  navigationArrows = false,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number>(screenWidth);
  const [containerHeight, setContainerHeight] = useState<number>(screenHeight);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollToIndex(nextIndex);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * containerWidth, animated: true });
      setCurrentIndex(index);
    }
  };

  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / containerWidth);
    setCurrentIndex(index);
  };

  const onLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
  };

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {navigationArrows && currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.arrow, styles.arrowLeft]}
          onPress={() => scrollToIndex(currentIndex - 1)}
          activeOpacity={0.7}
        >
          <Text style={styles.arrowText}>{'‹'}</Text>
        </TouchableOpacity>
      )}
      {navigationArrows && currentIndex < images.length - 1 && (
        <TouchableOpacity
          style={[styles.arrow, styles.arrowRight]}
          onPress={() => scrollToIndex(currentIndex + 1)}
          activeOpacity={0.7}
        >
          <Text style={styles.arrowText}>{'›'}</Text>
        </TouchableOpacity>
      )}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {images.map((img, index) => (
          <View key={index} style={[styles.slide, { width: containerWidth, height: containerHeight }]}> 
            <Image source={{ uri: img }} style={[styles.backgroundImage, { width: containerWidth, height: containerHeight }]} />
            {darkenImage && <View style={styles.overlay} />}

            <View style={styles.content}>
              {titles[index] && <Text style={styles.title}>{titles[index]}</Text>}
              {subtitles[index] && (
                <Text style={styles.subtitle}>{subtitles[index]}</Text>
              )}
              {buttonLabels[index] && buttonLinks[index] && (
                <TouchableOpacity
                  onPress={buttonLinks[index]}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{buttonLabels[index]}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer} pointerEvents="none">
        {images.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, currentIndex === i && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLeft: {
    left: 10,
  },
  arrowRight: {
    right: 10,
  },
  arrowText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },
});

export default Carousel;
