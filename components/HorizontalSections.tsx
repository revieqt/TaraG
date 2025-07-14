import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Button from './Button';

interface HorizontalSectionsProps {
  labels: string[];
  sections: React.ReactNode[];
  type?: 'roundTab' | 'fullTab' | 'dotIdentifier';
  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  tabTextStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  activeTabTextStyle?: ViewStyle;
}

const { width } = Dimensions.get('window');

const HorizontalSections: React.FC<HorizontalSectionsProps> = ({
  labels,
  sections,
  type = 'dotIdentifier',
  containerStyle,
  tabStyle,
  tabTextStyle,
  activeTabStyle,
  activeTabTextStyle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTabPress = (idx: number) => {
    setActiveIndex(idx);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: idx * width, animated: true });
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(newIndex);
  };

  // Tab Chooser: roundTab style
  const renderRoundTab = () => (
    <View style={[styles.tabRow, { marginBottom: 12 }]}> 
      {labels.map((label, idx) => (
        <Button
          key={label}
          title={label}
          onPress={() => handleTabPress(idx)}
          buttonStyle={[
            styles.roundTab,
            tabStyle,
            activeIndex === idx && styles.activeRoundTab,
            activeIndex === idx && activeTabStyle,
          ].filter(Boolean) as ViewStyle[]}
          textStyle={[
            styles.roundTabText,
            tabTextStyle,
            activeIndex === idx && styles.activeRoundTabText,
            activeIndex === idx && activeTabTextStyle,
          ].filter(Boolean) as TextStyle[]}
        />
      ))}
    </View>
  );

  // Tab Chooser: fullTab style (like Explore)
  const renderFullTab = () => (
    <View style={[styles.fullTabRow, tabStyle]}> 
      {labels.map((label, idx) => (
        <TouchableOpacity
          key={label}
          style={[
            styles.fullTabButton,
            activeIndex === idx && styles.activeFullTabButton,
            activeIndex === idx && activeTabStyle,
            { flex: 1 },
          ].filter(Boolean) as ViewStyle[]}
          onPress={() => handleTabPress(idx)}
          activeOpacity={0.7}
        >
          <View style={styles.fullTabInnerContainer}>
            <Text style={[
              styles.fullTabText,
              tabTextStyle,
              activeIndex === idx && styles.activeFullTabText,
              activeIndex === idx && activeTabTextStyle,
            ].filter(Boolean) as TextStyle[]}>{label}</Text>
          </View>
          <View style={[
            styles.fullTabUnderline,
            activeIndex === idx && styles.activeFullTabUnderline,
          ].filter(Boolean) as ViewStyle[]} />
        </TouchableOpacity>
      ))}
    </View>
  );

  // Dot identifier (like onboarding)
  const renderDotIdentifier = () => (
    <View style={styles.dotsContainer}>
      {labels.map((_, idx) => (
        <View
          key={idx}
          style={[
            styles.dot,
            activeIndex === idx ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}> 
      {type === 'roundTab' && renderRoundTab()}
      {type === 'fullTab' && renderFullTab()}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        contentContainerStyle={{ width: width * labels.length }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={{ flex: 1 }}
      >
        {sections.map((section, idx) => (
          <View key={idx} style={[styles.section, { width }]}> 
            {section}
          </View>
        ))}
      </ScrollView>
      {type === 'dotIdentifier' && renderDotIdentifier()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  section: {
    flex: 1,
    height: '100%',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  roundTab: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: '#00CAFF',
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  activeRoundTab: {
    backgroundColor: '#00CAFF',
    borderColor: '#00CAFF',
  },
  roundTabText: {
    color: '#00CAFF',
    fontWeight: 'bold',
  },
  activeRoundTabText: {
    color: '#fff',
  },
  fullTabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 48,
  },
  fullTabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeFullTabButton: {
    backgroundColor: 'transparent',
  },
  fullTabInnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  fullTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  activeFullTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  fullTabUnderline: {
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  activeFullTabUnderline: {
    backgroundColor: '#007AFF',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#00FFDE',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default HorizontalSections; 