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
};

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({ children, buttons }) => {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(250)).current;

  const toggleExpand = () => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 350 : SCREEN_HEIGHT-130,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setExpanded(!expanded));
  };

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={toggleExpand}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{expanded ? 'Collapse' : 'Expand'}</Text>
        </TouchableOpacity>
        {buttons && <View style={styles.extraButtons}>{buttons}</View>}
      </View>
      <View style={styles.overlay}></View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'red',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 16,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  extraButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  overlay:{
    width: '100%',
    height: 20,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff'
  }
});

export default CollapsibleHeader;
