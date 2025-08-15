import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import NotificationsButton from '@/components/custom/NotificationsButton';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { hasUnreadNotifications } from '@/services/firestore/userDbService';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ExploreSearchModal from '../explore/explore-search';
import GradientHeader from '@/components/GradientHeader';

export default function ExploreScreen() {
  const { session } = useSession();
  const userId = session?.user?.id;
  const [hasUnread, setHasUnread] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const headerHeight = 80;
  const tabHeight = 48;

  useEffect(() => {
    if (!userId) return;
    hasUnreadNotifications(userId).then(setHasUnread);
  }, [userId]);

  // Initialize lastScrollY when component mounts
  useEffect(() => {
    lastScrollY.current = 0;
  }, []);

  // Handle tab press - scroll to top if clicking active tab
  const handleTabPress = (idx: number) => {
    if (idx === activeTab) {
      // If clicking the current active tab, scroll to top
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      // If clicking a different tab, switch to that tab
      setActiveTab(idx);
    }
  };

  // Custom scroll handler to detect scroll direction
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const isScrollingUp = currentScrollY < lastScrollY.current;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
    
    scrollY.setValue(currentScrollY);
    
    // If scrolling up and difference is significant enough
    if (isScrollingUp && scrollDifference > 10) {
      console.log('SHOWING HEADER - Scrolling up');
      Animated.parallel([
        Animated.timing(headerVisible, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else if (!isScrollingUp && currentScrollY > stickyHeight) {
      Animated.parallel([
        Animated.timing(headerVisible, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: -stickyHeight,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
    
    lastScrollY.current = currentScrollY;
  };

  const renderExploreSection = () => (
    <ScrollView 
      ref={activeTab === 0 ? scrollViewRef : null}
      showsVerticalScrollIndicator={false} 
      style={{width: '100%', height: '100%'}}
      contentContainerStyle={{ paddingTop: stickyHeight }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
        <GradientHeader/>
        <View
          style={styles.postInput}
        >
          <TouchableOpacity onPress={() => router.push("/account/viewProfile")}>
            <Image
              source={{ uri: session?.user?.profileImage || 'https://ui-avatars.com/api/?name=User' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          
          <Button
            title='Share something to the world'
            onPress={() => router.push("/explore/explore-post")}
            buttonStyle={{
              flex: 1,
              marginBottom: 15,
              alignItems: 'flex-start',
            }}
          />
        </View>

        <ThemedView color='primary' shadow style={styles.postContainer}>
          <TouchableOpacity onPress={() => router.push("/account/viewProfile")} style={{flexDirection: 'row'}}>
            <Image
              source={{ uri: session?.user?.profileImage || 'https://ui-avatars.com/api/?name=User' }}
              style={styles.postProfileImage}
            />
            <View style={{marginTop: -5, marginLeft: 10}}>
              <ThemedText>username_of_user</ThemedText>
              <ThemedText style={{marginTop: -5, fontSize: 12, opacity: 0.5}}>type_of_user</ThemedText>
            </View>
          </TouchableOpacity>
        </ThemedView>

        {/* Additional content to make scrolling more noticeable */}
        {Array.from({ length: 10 }).map((_, index) => (
          <ThemedView key={index} color='primary' shadow style={styles.postContainer}>
            <TouchableOpacity onPress={() => router.push("/account/viewProfile")} style={{flexDirection: 'row'}}>
              <Image
                source={{ uri: session?.user?.profileImage}}
                style={styles.postProfileImage}
              />
              <View style={{marginTop: -5, marginLeft: 10}}>
                <ThemedText>Sample Post {index + 1}</ThemedText>
                <ThemedText style={{marginTop: -5, fontSize: 12, opacity: 0.5}}>This is sample content to test scrolling</ThemedText>
              </View>
            </TouchableOpacity>
            <View style={{marginTop: 10}}>
              <ThemedText>This is additional content to make the post longer and enable vertical scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ThemedText>
            </View>
          </ThemedView>
        ))}
         
       </ScrollView>
   );

  // Render function for Tours section
  const renderToursSection = () => (
    <ScrollView 
      ref={activeTab === 1 ? scrollViewRef : null}
      showsVerticalScrollIndicator={false}
      style={{width: '100%', height: '100%'}}
      contentContainerStyle={{ paddingTop: stickyHeight }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
        <View style={styles.carouselContainer}>
          <Carousel
            images={[
              'https://scontent.fceb3-1.fna.fbcdn.net/v/t39.30808-6/487153408_2700054723520291_7044497368256917857_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEXEYgFgtzSLjm4zUwaHT0YO8FKtsWq1147wUq2xarXXs4RiOCRcjrgQD_GLvj8x16VL7JqwWKlypXJPGtJJjEH&_nc_ohc=EXbls88HNYMQ7kNvwHoGU4Y&_nc_oc=AdnwkAqzh4pc7VRgqlpsAb_E4O8ZzMe5IpqNJ_REQO4XJlj4T8AFSGxZPCHPQwXlquI&_nc_zt=23&_nc_ht=scontent.fceb3-1.fna&_nc_gid=cVjqKxsf9C_N0zQIDgh09g&oh=00_AfSUgc69_tt_tlZLz6IRzPEqdSwxXVZ11eYjOygDHSXTtw&oe=687B51A1', 
              'https://scontent.fceb3-1.fna.fbcdn.net/v/t1.6435-9/68551414_1437987093033160_2096824646182633472_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEiTsJOwexKfdcCND3hxeVT9yAye2WI66v3IDJ7ZYjrqwNNKgHfPyGNkWgH0tau_TiTwDzvFnjXPaXk-PaJbcIM&_nc_ohc=tXoXG6ggpWgQ7kNvwG1fUig&_nc_oc=Adn35v6CvfejHJ0WEM1A5CiaNRuqkyhC_chGI58xM4aXZaps--DC5Ndw58cywStlHOY&_nc_zt=23&_nc_ht=scontent.fceb3-1.fna&_nc_gid=8r91X_x7wuGmL5IkMpl32Q&oh=00_AfSDKr1u3sUh3gihQSfFQqaVuUoIL6PG6b3PcPjLwGRxrA&oe=689CE86B',
              'https://scontent.fceb3-1.fna.fbcdn.net/v/t39.30808-6/503873071_2075785779609719_2625728011966557119_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF7DANAjPgoX5pp0G3dS_FOitAi_5SlrEGK0CL_lKWsQfIWu_gd5r_-BoGKZPq8Zh-W2icNKafB18VmAMhMIu8C&_nc_ohc=x2Qted23h2cQ7kNvwGnODa3&_nc_oc=AdkB6_RKxm2ddouSqLd-ZYhbB5QdmZHu0WnBaJ3f0ebLA1rvmw59V2W9NcbABgzaKv0&_nc_zt=23&_nc_ht=scontent.fceb3-1.fna&_nc_gid=FGiVTkadZmaew-LW9NMHAQ&oh=00_AfR2-ixAoYxK-Xp0y-n9Ahd7gfffddrDXCxc8M0E7TBg8Q&oe=687B3B38'
            ]}
            titles={['Mark Ken Yangyang', 'Ed Lorenz Quiroga', 'Joel Janzel Brigildo']}
            subtitles={['potangina', 'oh oh', 'fiesta stall']}
            buttonLabels={['View Tour', 'View Tour','View Tour']}
            buttonLinks={[() => alert('Next'), () => alert('Done'), () => alert('Done')]}
            darkenImage
            navigationArrows
          />
        </View>

        {/* Additional content for Tours section */}
        {Array.from({ length: 5 }).map((_, index) => (
          <ThemedView key={index} color='primary' shadow style={styles.postContainer}>
            <ThemedText type='subtitle'>Tour {index + 1}</ThemedText>
            <ThemedText>This is a sample tour description that makes the content longer for testing vertical scrolling.</ThemedText>
          </ThemedView>
                 ))}
       </ScrollView>
   );

  // Render function for Your Groups section
  const renderGroupsSection = () => (
    <ScrollView 
      ref={activeTab === 2 ? scrollViewRef : null}
      showsVerticalScrollIndicator={false}
      style={{width: '100%', height: '100%'}}
      contentContainerStyle={{ paddingTop: stickyHeight }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
        <View style={styles.groupButtonsContainer}>
          <Button title='Create Group' onPress={() => alert('Done')}/>
          <Button title='Join with Invite Code' onPress={() => alert('Done')}/>
                 </View>
       </ScrollView>
   );

  // Calculate the total height of sticky elements
  const stickyHeight = headerHeight + tabHeight;
  
  // Create a separate animated value for header visibility
  const headerVisible = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  
  // Use the headerVisible value for opacity
  const headerOpacity = headerVisible;

  return (
    <ThemedView style={styles.container}>
      {/* Sticky Header */}
      <Animated.View 
        style={[
          styles.stickyHeader,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}
      >
        <ThemedView style={styles.header} color='primary'>
          <ThemedText type='subtitle'>Explore</ThemedText>
          <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
              <ThemedIcons library="MaterialIcons" name="search" size={25}/>
            </TouchableOpacity>
            <NotificationsButton userId={userId} />
          </View>
        </ThemedView>
      </Animated.View>

      <ExploreSearchModal visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} />
      
      {/* Sticky Tab Chooser */}
      <Animated.View 
        style={[
          styles.stickyTabContainer,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}
      >
        <ThemedView color='primary' style={styles.tabRow}>
          {['Explore', 'Tours', 'Your Groups'].map((label, idx) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.tabButton,
                activeTab === idx && styles.activeTabButton,
                { flex: 1 },
              ]}
              onPress={() => handleTabPress(idx)}
              activeOpacity={0.7}
            >
              <View style={styles.tabInnerContainer}>
                <ThemedText style={[
                  styles.tabText,
                  activeTab === idx && styles.activeTabText,
                ]}>{label}</ThemedText>
              </View>
              <View style={[
                styles.tabUnderline,
                activeTab === idx && styles.activeTabUnderline,
              ]} />
            </TouchableOpacity>
          ))}
        </ThemedView>
      </Animated.View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={[styles.sectionContainer, { display: activeTab === 0 ? 'flex' : 'none' }]}>
          {renderExploreSection()}
        </View>
        <View style={[styles.sectionContainer, { display: activeTab === 1 ? 'flex' : 'none' }]}>
          {renderToursSection()}
        </View>
        <View style={[styles.sectionContainer, { display: activeTab === 2 ? 'flex' : 'none' }]}>
          {renderGroupsSection()}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 20,
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  carouselContainer:{
    width: '100%',
    height: 350,
  },
  postInput: {
    margin: 20,
    flexDirection: 'row',
  },
  profileImage: {
    width: 45, 
    height: 45,
    borderRadius: 30,
    marginRight: 15,
  },
  postContainer:{
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    minHeight: 100,
  },
  postProfileImage:{
    width: 35,
    aspectRatio: 1,
    borderRadius: 30,
  },
  groupButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    padding: 20,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  collapsibleHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  stickyTabContainer: {
    position: 'absolute',
    top: 78,
    left: 0,
    right: 0,
    zIndex: 998,
    backgroundColor: 'transparent',
  },
  tabRow: {
    flexDirection: 'row',   
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: 48,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeTabButton: {
    backgroundColor: 'transparent',
  },
  tabInnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  tabUnderline: {
    height: 3,
    width: '80%',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  activeTabUnderline: {
    backgroundColor: '#007AFF',
  },
  contentContainer: {
    flex: 1,
    marginTop: 0, // No margin needed since content will scroll under the sticky elements
  },
  sectionContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});