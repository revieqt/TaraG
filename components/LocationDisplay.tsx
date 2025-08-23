// LocationDisplay.tsx
import { ThemedIcons } from "@/components/ThemedIcons";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

type LocationDisplayProps = {
  content: React.ReactNode[];
};

const LocationDisplay: React.FC<LocationDisplayProps> = ({ content }) => {
  const [topOffset, setTopOffset] = useState<number | null>(null);
  const [bottomOffset, setBottomOffset] = useState<number | null>(null);

  const handleLayout = (e: LayoutChangeEvent, index: number) => {
    const { y, height } = e.nativeEvent.layout;
    if (index === 0) {
      // First item top connector
      setTopOffset(y + 10); // adjust to connector
    }
    if (index === content.length - 1) {
      // Last item bottom connector
      setBottomOffset(y + 10); // adjust to connector
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        {/* Render central line only when we know both offsets */}
        {topOffset !== null && bottomOffset !== null && (
          <View
            style={[
              styles.timeline,
              { top: topOffset, height: bottomOffset - topOffset },
            ]}
          />
        )}

        {content.map((child, index) => (
          <View
            key={index}
            style={styles.itemRow}
            onLayout={(e) => handleLayout(e, index)}
          >
            {/* Pin + Connector */}
            <View style={styles.pinColumn}>
              {/* Horizontal connector */}
              <View style={styles.connector} />
              <View>
                <ThemedIcons
                  library="MaterialIcons"
                  name="location-on"
                  size={18}
                  color="green"
                />
              </View>
            </View>

            {/* Content */}
            <View style={styles.contentBox}>{child}</View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LocationDisplay;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  itemsContainer: {
    flex: 1,
    position: "relative",
  },
  timeline: {
    position: "absolute",
    width: 1,
    backgroundColor: "#ccc",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  pinColumn: {
    width: 40,
    flexDirection: "row",
    alignItems: "flex-start",
    position: "relative",
  },
  connector: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
    marginRight: 4,
  },
  contentBox: {
    flex: 1,
    paddingVertical: 2,
    paddingLeft: 8
  },
});
