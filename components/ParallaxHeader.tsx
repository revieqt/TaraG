import React, { ReactNode } from 'react';
import {
  View,
  Animated,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

interface ParallaxHeaderProps {
  children: ReactNode;
  header?: ReactNode;
  headerHeight?: number;
  maxHeight?: number; // Optional for stronger parallax
}

const ParallaxHeader: React.FC<ParallaxHeaderProps> = ({
  children,
  header,
  headerHeight = 200,
  maxHeight = 300,
}) => {
  const scrollY = new Animated.Value(0);

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, maxHeight - headerHeight],
    outputRange: [0, -(maxHeight - headerHeight)],
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.4, 1],
    extrapolateRight: 'clamp',
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            height: maxHeight,
            transform: [{ translateY: headerTranslate }, { scale }],
          },
        ]}
      >
        {header}
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: maxHeight }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
});

export default ParallaxHeader;
