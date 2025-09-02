import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    PanResponder,
    ScrollView,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints?: number[]; // decimals (e.g., 0.25 = 25% of screen height)
  defaultIndex?: number; // starting snap index
  style?: ViewStyle; // optional custom styles
}

export default function BottomSheet({
  children,
  snapPoints = [0.25, 0.5, 0.9],
  defaultIndex = 0,
  style,
}: BottomSheetProps) {
  const backgroundColor = useThemeColor({}, "primary");

  // Hidden offset (only handle visible)
  const hiddenOffset = SCREEN_HEIGHT - 40;

  // Convert decimals to pixel snap values
  const snapValues = [...snapPoints.map((p) => SCREEN_HEIGHT * (1 - p)), hiddenOffset];

  const translateY = useRef(new Animated.Value(snapValues[defaultIndex])).current;
  const lastSnap = useRef(snapValues[defaultIndex]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: snapValues[defaultIndex],
      useNativeDriver: true,
    }).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        let newY = lastSnap.current + g.dy;

        const minSnap = Math.min(...snapValues);
        const maxSnap = Math.max(...snapValues);

        if (newY < minSnap) newY = minSnap;
        if (newY > maxSnap) newY = maxSnap;

        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, g) => {
        const finalY = lastSnap.current + g.dy;

        const closest = snapValues.reduce((prev, curr) =>
          Math.abs(curr - finalY) < Math.abs(prev - finalY) ? curr : prev
        );

        lastSnap.current = closest;
        Animated.spring(translateY, {
          toValue: closest,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], backgroundColor: backgroundColor },
        style,
      ]}
    >
      {/* Handle zone (only draggable area) */}
      <View {...panResponder.panHandlers} style={styles.dragArea}>
        <View style={styles.handle} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT + 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dragArea: {
    paddingVertical: 15,
    marginBottom: 8,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  handle: {
    width: 60,
    height: 3,
    backgroundColor: "#ccc",
    borderRadius: 3,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
