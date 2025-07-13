import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ToggleButton from '@/components/ToggleButton';
import { auth, db } from '@/services/firestore/config';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const { width } = Dimensions.get('window');

const interests = [
  "Nature", "Outdoors", "City Life", "Culture", "History", "Arts", 
  "Water Activities", "Adventure", "Camping", "Relaxation", "Wellness", 
  "Social", "Aesthetics", "Events", "Entertainment"
];

export default function FirstLoginScreen() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleInterestToggle = (value: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedInterests(prev => [...prev, value]);
    } else {
      setSelectedInterests(prev => prev.filter(interest => interest !== value));
    }
  };

  // Configuration for intro screens - easily modifiable
const introScreens = [
  {
    content: (
      <View style={styles.introScreen}>
        <Image 
          source={require('@/assets/images/slide1-img.png')}
          style={styles.screenImage}
        />
        <ThemedText type="title" style={styles.screenTitle}>
          Welcome to TaraG!
        </ThemedText>
        <ThemedText style={styles.screenSubtitle}>
        TaraG is your ultimate travel companion app, designed to make every journey smarter, safer, and more enjoyable.
        </ThemedText>
      </View>
    ),
  },
  {
    content: (
      <View style={styles.introScreen}>
        <Image 
          source={require('@/assets/images/slide2-img.png')}
          style={styles.screenImage}
        />
        <ThemedText type="title" style={styles.screenTitle}>
          Smart Planning
        </ThemedText>
        <ThemedText style={styles.screenSubtitle}>
          Get personalized travel recommendations based on your preferences, weather conditions, and local insights.
        </ThemedText>
      </View>
    ),
  },
  {
    content: (
      <View style={styles.introScreen}>
        <Image 
          source={require('@/assets/images/slide3-img.png')}
          style={styles.screenImage}
        />
        <ThemedText type="title" style={styles.screenTitle}>
          Community Connect
        </ThemedText>
        <ThemedText style={styles.screenSubtitle}>
          Join tours, share tips, ask questions, and connect with fellow adventurers for a more social and enriching travel experience.
        </ThemedText>
      </View>
    ),
  },
  {
    content: (
      <View style={styles.introScreen}>
        <Image 
          source={require('@/assets/images/slide4-img.png')}
          style={styles.screenImage}
        />
        <ThemedText type="title" style={styles.screenTitle}>
          Safety First
        </ThemedText>
        <ThemedText style={styles.screenSubtitle}>
          Stay informed with weather updates, route safety assessments, and quick access to emergency contacts.
        </ThemedText>
      </View>
    ),
  },
  
  {
    content: (
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 30 }}>
        <ThemedText type="title" style={{marginBottom: 10}}>
          Get to Know You
        </ThemedText>
        <ThemedText style={{  marginBottom: 20, opacity: 0.9 }}>
          Select at least 3 interests to personalize your experience
        </ThemedText>
        
        <ScrollView style={{ maxHeight: 400, width: '100%' }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingVertical: 20 }}>
            {interests.map((interest) => (
              <ToggleButton
                key={interest}
                value={interest}
                label={interest}
                onToggle={handleInterestToggle}
                textStyle={{ fontSize: 12 }}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    ),
  }
];

  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleFinish = async () => {
    if (selectedInterests.length < 3) return;

    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          isFirstLogin: false,
          likes: selectedInterests
        });
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const renderIntroScreen = (screen: typeof introScreens[0], index: number) => (
    <View key={index} style={styles.screenContainer}>
      {screen.content}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        contentContainerStyle={styles.scrollContainer}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentScreen(newIndex);
        }}
      >
        {introScreens.map((screen, index) => renderIntroScreen(screen, index))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentScreen < 4 ? (
          null
        ) : (
          <TouchableOpacity
            style={[
              styles.finishButton,
              selectedInterests.length < 3 && styles.disabledButton
            ]}
            onPress={handleFinish}
            disabled={selectedInterests.length < 3}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedInterests.length >= 3 ? ['#00FFDE', '#0065F8'] : ['#ccc', '#ccc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={[
                styles.buttonText,
                selectedInterests.length < 3 && styles.disabledText
              ]}>
                Get Started
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.dotsContainer}>
        {[...Array(5)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentScreen === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>

      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    width: width * 5, 
  },
  screenContainer: {
    width: width,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  introScreen:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 30
  },
  screenTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  screenSubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  screenImage: {
    width: 200, 
    height: 200,
    marginBottom: 60, 
    resizeMode: 'contain'
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
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
  navigationContainer: {
    position: 'absolute',
    bottom: 100,
    left: 30,
    right: 30,
  },
  finishButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#666',
  },
});