import Carousel from '@/components/Carousel';
import NotificationsButton from '@/components/custom/NotificationsButton';
import HorizontalSections from '@/components/HorizontalSections';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { router } from 'expo-router';
import { hasUnreadNotifications } from '@/services/firestore/userDbService';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Image } from 'react-native';

export default function ExploreScreen() {
  const { session } = useSession();
  const userId = session?.user?.id;
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!userId) return;
    hasUnreadNotifications(userId).then(setHasUnread);
  }, [userId]);


  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type='subtitle'>Explore</ThemedText>
        <NotificationsButton userId={userId} />
      </ThemedView>
      <HorizontalSections
        labels={['Explore', 'Tours', 'Your Groups']}
        sections={[
          <View key="explore" style={styles.tabContent}>
            <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>
              {/* Post input UI */}
              <TouchableOpacity
                style={styles.postInputContainer}
                onPress={() => router.push("/explore/explore-post")}
              >
                <View style={styles.postRow}>
                  <Image
                    source={{ uri: session?.user?.profileImage || 'https://ui-avatars.com/api/?name=User' }}
                    style={styles.profileImage}
                  />
                  <View style={styles.postInputBox}>
                    <ThemedText>Share something to the world</ThemedText>
                  </View>
                </View>

                <View style={styles.postRow}>
                  <TouchableOpacity style={styles.attachButton}>
                    <ThemedText style={styles.attachButtonText}>Attach Route</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.attachButton}>
                    <ThemedText style={styles.attachButtonText}>Attach Itinerary</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.attachButton}>
                    <ThemedText style={styles.attachButtonText}>Attach Group</ThemedText>
                  </TouchableOpacity>
                </View>
                
              </TouchableOpacity>
            </ScrollView>
          </View>,

          <View key="tours" style={styles.tabContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.carouselContainer}>
                <Carousel
                  images={['https://scontent.fceb3-1.fna.fbcdn.net/v/t39.30808-6/487153408_2700054723520291_7044497368256917857_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEXEYgFgtzSLjm4zUwaHT0YO8FKtsWq1147wUq2xarXXs4RiOCRcjrgQD_GLvj8x16VL7JqwWKlypXJPGtJJjEH&_nc_ohc=EXbls88HNYMQ7kNvwHoGU4Y&_nc_oc=AdnwkAqzh4pc7VRgqlpsAb_E4O8ZzMe5IpqNJ_REQO4XJlj4T8AFSGxZPCHPQwXlquI&_nc_zt=23&_nc_ht=scontent.fceb3-1.fna&_nc_gid=cVjqKxsf9C_N0zQIDgh09g&oh=00_AfSUgc69_tt_tlZLz6IRzPEqdSwxXVZ11eYjOygDHSXTtw&oe=687B51A1', 
                    'https://scontent.fceb3-1.fna.fbcdn.net/v/t1.6435-9/68551414_1437987093033160_2096824646182633472_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEiTsJOwexKfdcCND3hxeVT9yAye2WI66v3IDJ7ZYjrqwNNKgHfPyGNkWgH0tau_TiTwDzvFnjXPaXk-PaJbcIM&_nc_ohc=tXoXG6ggpWgQ7kNvwG1fUig&_nc_oc=Adn35v6CvfejHJ0WEM1A5CiaNRuqkyhC_chGI58xM4aXZaps--DC5Ndw58cywStlHOY&_nc_zt=23&_nc_ht=scontent.fceb3-1.fna&_nc_gid=8r91X_x7wuGmL5IkMpl32Q&oh=00_AfSDKr1u3sUh3gihQSfFQqaVuUoIL6PG6b3PcPjLwGRxrA&oe=689CE86B',
                    'https://scontent.fceb3-1.fna.fbcdn.net/v/t39.30808-6/503873071_2075785779609719_2625728011966557119_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF7DANAjPgoX5pp0G3dS_FOitAi_5SlrEGK0CL_lKWsQfIWu_gd5r_-BoGKZPq8Zh-W2icNKafB18VmAMhMIu8C&_nc_ohc=x2Qted23h2cQ7kNvwGnODa3&_nc_oc=AdkB6_RKxm2ddouSqLd-ZYhbB5QdmZHu0WnBaJ3f0ebLA1rvmw59V2W9NcbABgzaKv0&_nc_zt=23&_nc_ht=scontent.fceb3-1.fna&_nc_gid=FGiVTkadZmaew-LW9NMHAQ&oh=00_AfR2-ixAoYxK-Xp0y-n9Ahd7gfffddrDXCxc8M0E7TBg8Q&oe=687B3B38']}
                  titles={['Mark Ken Yangyang', 'Ed Lorenz Quiroga', 'Joel Janzel Brigildo']}
                  subtitles={['potangina', 'oh oh', 'fiesta stall']}
                  buttonLabels={['View Tour', 'View Tour','View Tour']}
                  buttonLinks={[() => alert('Next'), () => alert('Done'), () => alert('Done')]}
                  darkenImage
                  navigationArrows
                />
              </View>


            </ScrollView>
          </View>,

          <View key="your-groups" style={styles.tabContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              
            </ScrollView>
          </View>,
        ]}
        type="fullTab"
      />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer:{
    width: '100%',
    height: 350,
  },
  postInputContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    margin: 16,
    gap: 10,
  },
  postRow:{
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  postInputBox: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    marginRight: 8,
    justifyContent: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  attachButton: {
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  attachButtonText: {
    color: '#3730A3',
    fontWeight: '600',
    fontSize: 14,
  },
});