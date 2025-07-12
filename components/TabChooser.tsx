import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Button from './Button';

interface TabChooserProps {
  tabs: string[];
  onTabChange?: (index: number) => void;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeButtonStyle?: ViewStyle;
  activeTextStyle?: TextStyle;
  initialIndex?: number;
  selectedIndex?: number; // <-- Add this line
}

const TabChooser: React.FC<TabChooserProps> = ({
  tabs,
  onTabChange,
  containerStyle,
  buttonStyle,
  textStyle,
  activeButtonStyle,
  activeTextStyle,
  initialIndex = 0,
  selectedIndex, // <-- Add this line
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Sync with controlled selectedIndex
  useEffect(() => {
    if (typeof selectedIndex === 'number' && selectedIndex !== activeIndex) {
      setActiveIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const handlePress = (index: number) => {
    setActiveIndex(index);
    if (onTabChange) onTabChange(index);
  };

  return (
    <View style={[containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {tabs.map((tab, idx) => (
          <Button
            key={tab}
            title={tab}
            onPress={() => handlePress(idx)}
            buttonStyle={
                [
                styles.button,
                buttonStyle,
                activeIndex === idx && styles.activeButton,
                activeIndex === idx && activeButtonStyle,
                ].filter(Boolean) as ViewStyle[]
            }
            textStyle={
                [
                styles.text,
                textStyle,
                activeIndex === idx && styles.activeText,
                activeIndex === idx && activeTextStyle,
                ].filter(Boolean) as TextStyle[]
            }
            />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: '#00CAFF',
    borderColor: '#00CAFF',
    borderWidth: 2,
  },
  text: {
    color: 'gray',
  },
  activeText: {
    color: '#fff',
  },
});

export default TabChooser;