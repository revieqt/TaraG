import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocation } from '@/hooks/useLocation';
import NotificationsButton from '@/components/custom/NotificationsButton';
import { router } from 'expo-router';
import ParallaxHeader from '@/components/ParallaxHeader';
import { useSession } from '@/context/SessionContext';
import TaraMap from '@/components/maps/TaraMap';
import {  StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

export default function HomeScreen() {
  const { session } = useSession();
  const user = session?.user;
  const { suburb, city, state, loading, error } = useLocation();

  const getLocationText = () => {
    if (loading) return 'Getting your location...';
    if (error) return 'Location unavailable';
    if (suburb && city) return `${suburb}, ${city}`;
    if (city) return city;
    if (suburb) return suburb;
    return 'Location unavailable';
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ParallaxHeader
       header={
          <View style={styles.headerContainer}>
          <TaraMap mapStyle={styles.mapBackground} />
          <LinearGradient
            colors={['transparent', '#fff']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradientOverlay}
            pointerEvents="none"
          />
          <View style={styles.headerContent}>
            <View style={styles.notificationContainer}>
              <NotificationsButton />
            </View>
            
            <View style={styles.textContainer}>
              <ThemedText type='title'>
                Hello {user?.fname ? `${user.fname}` : ''}!
              </ThemedText>
              <ThemedText type='subtitle'>Welcome to TaraG!</ThemedText>
            </View>
          </View>
        </View>
      }
        headerHeight={100}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuOptions} onPress={() => router.push('/home/routes')}>
              <ThemedView roundness={50} color='secondary' style={styles.menuButton}>
                <ThemedIcons library='MaterialIcons' name='route' size={20} color='#fff'/>
              </ThemedView>
              <ThemedText>Routes</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOptions} onPress={() => router.push('/home/itineraries/itineraries')}>
              <ThemedView roundness={50} color='secondary' style={styles.menuButton}>
              <ThemedIcons library='MaterialIcons' name='event-note' size={20} color='#fff'/>
              </ThemedView>
              <ThemedText>Itineraries</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOptions} onPress={() => router.push('/home/safety')}>
              <ThemedView roundness={50} color='secondary' style={styles.menuButton}>
              <ThemedIcons library='MaterialDesignIcons' name='car-brake-alert' size={20} color='#fff'/>
              </ThemedView>
              <ThemedText>Safety</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOptions} onPress={() => router.push('/home/aiChat')}>
              <ThemedView roundness={50} color='secondary' style={styles.menuButton}>
                <ThemedIcons library='MaterialDesignIcons' name='robot-happy-outline' size={20} color='#fff'/>
              </ThemedView>
              <ThemedText>TaraAI</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedView shadow style={styles.locationContent}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/maps')}>
              <ThemedText>You're currently at</ThemedText>
              <ThemedText type='subtitle'>{getLocationText()}</ThemedText>
            </TouchableOpacity>
            
          </ThemedView>

          <View style={styles.grid}>
            <ThemedView shadow style={[{padding: 15},styles.gridItem]}>
              <ThemedText type='defaultSemiBold'>{city}</ThemedText>
              <ThemedText type='subtitle'>30</ThemedText>
              
            </ThemedView>

            <View style={styles.gridItem}>
              <ThemedView shadow style={styles.gridItemChild}>
                <ThemedText>Emergency State</ThemedText>
              </ThemedView>
              <ThemedView shadow style={styles.gridItemChild}>
                <ThemedText>Explore more features in the app!</ThemedText>
              </ThemedView>
            </View>
          </View>
        </View>
      </ParallaxHeader>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  gradientOverlay: {
    height: 100,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    pointerEvents: 'none', // Allow touches to pass through to map
  },
  headerContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 20,
    zIndex: 3,
    pointerEvents: 'box-none', // This allows touches to pass through except for the actual content
  },
  notificationContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 20,
  },
  menu:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 25,
  },
  menuOptions:{
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuButton:{
    width: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationContent: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  redirectToTara: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  headerButtons:{
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  gridItem: {
    width: '48%',
    height: 150,
    borderRadius: 10,
  },
  gridItemChild: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
    height: '47%', // This ensures equal height for both children
    marginBottom: 10,
  },
});