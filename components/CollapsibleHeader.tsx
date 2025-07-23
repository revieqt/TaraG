import { ThemedView } from '@/components/ThemedView';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type CollapsibleHeaderProps = {
  children?: React.ReactNode;
  buttons?: React.ReactNode;
  defaultHeight?: number;
  expandedAllowance?: number;
  disableExpand?: boolean; // <-- Added prop
};

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({
  children,
  buttons,
  defaultHeight,
  expandedAllowance,
  disableExpand, // <-- Added prop
}) => {
  const collapsedHeight = defaultHeight ?? 350;
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(collapsedHeight)).current;

  const allowance = typeof expandedAllowance === 'number' ? expandedAllowance : 150;

  const toggleExpand = () => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? collapsedHeight : SCREEN_HEIGHT - allowance,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setExpanded(!expanded));
  };

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
      <View style={styles.buttonRow}>
        {!disableExpand && (
          <TouchableOpacity
            style={styles.button}
            onPress={toggleExpand}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{expanded ? 'Collapse' : 'Expand'}</Text>
          </TouchableOpacity>
        )}
        {buttons && <View style={styles.extraButtons}>{buttons}</View>}
      </View>
      <ThemedView shadow style={styles.overlay}></ThemedView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'red',
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 16,
    zIndex: 10,
    gap: 8,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)'
  },
  extraButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  overlay: {
    width: '100%',
    height: 20,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 5,
  }
});

export default CollapsibleHeader;