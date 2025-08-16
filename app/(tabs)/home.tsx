import CubeButton from '@/components/CubeButton';
import NotificationsButton from '@/components/custom/NotificationsButton';
import HomeMap from '@/components/maps/HomeMap';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { useAlerts } from '@/hooks/useAlerts';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getWeatherImage } from '@/utils/weatherUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { AlertCard } from '@/components/AlertCard';
import { Alert } from '@/hooks/useAlerts';

export default function HomeScreen() {
  const { session } = useSession();
  const user = session?.user;
  const { suburb, city, loading, error, latitude, longitude } = useLocation();
  const { weatherData, loading: weatherLoading, error: weatherError } = useWeather(latitude || 0, longitude || 0);
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondary');
  const tintColor = useThemeColor({}, 'tint');

  // Use alerts hook with user location
  const userLocation = {
    suburb,
    city,
    state: '',
    region: '',
    country: ''
  };
  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts(userLocation);

  const getLocationText = () => {
    if (error) return 'Location unavailable';
    if (suburb && city) return `${suburb}, ${city}`;
    if (city) return city;
    if (suburb) return suburb;
    return 'Location unavailable';
  };

  const handleAlertPress = (alert: Alert) => {
    router.push({
      pathname: '/account/alert-view',
      params: {
        alertId: alert.id,
        title: alert.title,
        note: alert.note,
        severity: alert.severity,
        target: alert.target.join(', ')
      }
    });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{height: 300, overflow: 'hidden'}}>
          <TouchableOpacity 
            style={{flex: 1}} 
            onPress={() => router.push('/(tabs)/maps')}
          >
            <HomeMap/>
          </TouchableOpacity>
          <LinearGradient
            colors={['transparent', backgroundColor]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradientOverlay}
            pointerEvents="none"
          />
          <View style={styles.headerContent}>
            <View style={styles.notificationContainer}>
              <TouchableOpacity onPress={() => router.push('/(tabs)/maps')}>
                <ThemedView roundness={20} color='primary' style={styles.redirectToMap}>  
                  <ThemedIcons library="MaterialIcons" name="map" size={20}/>
                  <ThemedText>More on Maps</ThemedText>
                </ThemedView>
              </TouchableOpacity>
              <NotificationsButton />
            </View>
            
            <View style={styles.textContainer}>
              <ThemedText type='title' style={{color: secondaryColor}}>
                Hello {user?.fname ? `${user.fname}` : ''}!
              </ThemedText>
              <ThemedText type='defaultSemiBold' style={{opacity: 0.7}}>Welcome to TaraG!</ThemedText>
            </View>
          </View>

          <Image source={require('@/assets/images/tara-cheerful.png')} style={styles.taraImage} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.menu}>
            <View style={styles.menuOptions}>
              <CubeButton
                size={60}
                iconName="route"
                iconSize={27}
                iconColor="#fff"
                onPress={() => router.push('/home/routes/routes')}
              />
              <ThemedText>Routes</ThemedText>
            </View>

            <View style={styles.menuOptions}>
              <CubeButton
                size={60}
                iconName="event-note"
                iconSize={27}
                iconColor="#fff"
                onPress={() => router.push('/home/itineraries/itineraries')}
              />
              <ThemedText>Itineraries</ThemedText>
            </View>

            <View style={styles.menuOptions}>
              <CubeButton
                size={60}
                iconLibrary="MaterialDesignIcons"
                iconName="car-brake-alert"
                iconSize={27}
                iconColor="#fff"
                onPress={() => router.push('/home/safety')}
              />
              <ThemedText>Safety</ThemedText>
            </View>

            <View style={styles.menuOptions}>
              <CubeButton
                size={60}
                iconLibrary="MaterialDesignIcons"
                iconName="robot-happy-outline"
                iconSize={27}
                iconColor="#fff"
                onPress={() => router.push('/home/aiChat')}
              />
              <ThemedText>TaraAI</ThemedText>
            </View>
          </View>

          
          
          {loading ? (
             <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color={tintColor} />
             </View>
           ) : (
            <>
              <ThemedView shadow color='primary' style={styles.locationContent}>
                {/* Weather Image */}
                {weatherData && (
                  <Image 
                    source={getWeatherImage(weatherData.weatherCode)} 
                    style={styles.weatherImage}
                  />
                )}
                
                <ThemedText style={{opacity: .5}}>You're currently at</ThemedText>
                <ThemedText type='subtitle'>{getLocationText()}</ThemedText>
                {weatherData && (
                  <ThemedText style={{opacity: .5}}>
                    {weatherData.weatherType}
                  </ThemedText>
                )}
                <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 30}}>
                  <View style={styles.weather}>
                    <ThemedIcons library='MaterialDesignIcons' name='thermometer' size={20} color='#B36B6B'/>
                    <ThemedText type='defaultSemiBold' style={{marginTop: 3}}>
                      {weatherData ? `${Math.round(weatherData.temperature)}°C` : '0°C'}
                    </ThemedText>
                    <ThemedText style={{opacity: .5}}>Temperature</ThemedText>
                  </View>
                  <View style={styles.weather}>
                    <ThemedIcons library='MaterialDesignIcons' name='cloud' size={20} color='#6B8BA4'/>
                    <ThemedText type='defaultSemiBold' style={{marginTop: 3}}>
                      {weatherData ? `${weatherData.precipitation}mm` : '0mm'}
                    </ThemedText>
                    <ThemedText style={{opacity: .5}}>Precipitation</ThemedText>
                  </View>
                  <View style={styles.weather}>
                    <ThemedIcons library='MaterialDesignIcons' name='water' size={20} color='#5A7D9A'/>
                    <ThemedText type='defaultSemiBold' style={{marginTop: 3}}>
                      {weatherData ? `${weatherData.humidity}%` : '0%'}
                    </ThemedText>
                    <ThemedText style={{opacity: .5}}>Air Humidity</ThemedText>
                  </View>
                </View>
              </ThemedView>

              {/* Alerts Section */}
              {alerts.length > 0 && (
                <View style={styles.alertsSection}>
                  <View style={styles.alertsHeader}>
                    <ThemedText type="subtitle">Local Alerts</ThemedText>
                    <ThemedText style={styles.alertCount}>{alerts.length} alert{alerts.length !== 1 ? 's' : ''}</ThemedText>
                  </View>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.alertsScrollContainer}
                  >
                    {alerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onPress={handleAlertPress}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
          
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  taraImage: {
    position: 'absolute',
    bottom: -80,
    right: -20,
    width: 160,
    height: 250,
    zIndex: 2,
  },
  gradientOverlay: {
    height: 100,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3,
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
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  redirectToMap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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
  locationContent: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    overflow: 'hidden'
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
  alertsSection: {
    marginTop: 20,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  alertsScrollContainer: {
    paddingLeft: 0,
    paddingRight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 40,
  },
  weather:{
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%'
  },
  weatherImage: {
    position: 'absolute',
    right: 0,
    width: 150,
    height: 150,
    marginRight: -40,
    marginTop: -15,
  },
});