import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const LoadingAnimation: React.FC = () => {
  const translateX = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    const animate = () => {
      translateX.setValue(-200);
      Animated.loop(
        Animated.timing(translateX, {
          toValue: 400,
          duration: 1200,
          useNativeDriver: true,
        })
      ).start();
    };
    animate();
    return () => translateX.stopAnimation();
  }, [translateX]);

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <Animated.View
        style={[
          styles.wave,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f3f3f3',
    zIndex: 10,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e0e0e0',
  },
  wave: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 200,
    height: '100%',
    backgroundColor: 'rgba(180,180,180,0.25)',
    borderRadius: 20,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});

export default LoadingAnimation;
