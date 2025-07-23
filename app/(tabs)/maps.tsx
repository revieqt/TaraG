import Button from '@/components/Button';
import CollapsibleHeader from '@/components/CollapsibleHeader';
import FabMenu from '@/components/FabMenu';
import OptionsPopup from '@/components/OptionsPopup';
import TextField from '@/components/TextField';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import NotificationsButton from '@/components/custom/NotificationsButton';
import { useLocation } from '@/hooks/useLocation';
import { wikipediaService } from '@/services/wikipediaService';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const { suburb, city, loading, error } = useLocation();
  const [wikiInfo, setWikiInfo] = useState<string | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiImage, setWikiImage] = useState<string | null>(null);
  const [wikiImageLoading, setWikiImageLoading] = useState(false);
  const [homeContentState, setHomeContentState] = useState<'default' | 'searchLocation'>('default');

  useEffect(() => {
    if (city) {
      setWikiLoading(true);
      setWikiImageLoading(true);
      wikipediaService.getInfo(city)
        .then(info => setWikiInfo(info))
        .finally(() => setWikiLoading(false));
      wikipediaService.getImage(city)
        .then(img => setWikiImage(img))
        .finally(() => setWikiImageLoading(false));
    } else {
      setWikiInfo(null);
      setWikiImage(null);
    }
  }, [city]);

  const getLocationText = () => {
    if (loading) return 'Getting your location...';
    if (error) return 'Location unavailable';
    if (suburb && city) return `${suburb}, ${city}`;
    if (city) return city;
    if (suburb) return suburb;
    return 'Location unavailable';
  };


  return (
    <ThemedView style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CollapsibleHeader
          buttons={
            <>
              <Button title="3D View" onPress={() => {}} buttonStyle={styles.mapInputs} textStyle={{ fontSize: 14, color: 'white' }}/>

              <OptionsPopup actions={[{ 
                label: 'Option 1', onPress: () => {} },
                { label: 'Option 2', onPress: () => {} }]}
                >
                <View style={[styles.kebab,styles.mapInputs]}>
                  <ThemedIcons library="MaterialCommunityIcons" name="dots-vertical" size={22} color="#fff" />
                </View>
                
              </OptionsPopup>
            </>
            
          }
        >
          <View style={styles.header}>
            <TextField
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              style={[{ flex: 1, marginRight: 12, minWidth: 0 }, styles.mapInputs]}
              
            />
            <NotificationsButton style={styles.mapInputs} />
          </View>
          <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
          </View>
        </CollapsibleHeader>
        <View style={styles.homeContent}>
          {homeContentState === 'default' && (
            <>
              <ThemedText>You're currently at</ThemedText>
              <ThemedText type='subtitle'>{getLocationText()}</ThemedText>
              <ThemedText type='subtitle'>About {city}</ThemedText>
              <ThemedText style={{marginBottom: 20, color: 'gray'}}>General Information</ThemedText>
              {wikiImageLoading && <ThemedText>Loading image...</ThemedText>}
              {!wikiImageLoading && wikiImage && (
                <View style={{ alignItems: 'center', marginBottom: 12 }}>
                  <Image src={wikiImage} alt={city + ' image'} style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 10 }} />
                </View>
              )}
              {!wikiImageLoading && !wikiImage && <ThemedText>No image found.</ThemedText>}
              {wikiLoading && <ThemedText>Loading info...</ThemedText>}
              {!wikiLoading && wikiInfo && <ThemedText>{wikiInfo}</ThemedText>}
              {!wikiLoading && !wikiInfo && <ThemedText>No information found.</ThemedText>}

            </>
          )}
        </View>
      </ScrollView>

      <FabMenu
        mainLabel="Create Route"
        mainIcon={<ThemedIcons library='MaterialIcons' name="add" size={32} color="#fff" />}
        mainOnPress={() => router.push('/home/routes-create')}
        actions={[
          {
            label: 'Create Itineraries',
            icon: <ThemedIcons library='MaterialIcons' name="note-add"  size={20} color="#00FFDE" />,
            onPress: () => router.push('/home/itineraries/itineraries-create'),
          },
          {
            label: 'New Chat with AI',
            icon: <ThemedIcons library='MaterialDesignIcons' name="robot-happy-outline"  size={20} color="#00FFDE" />,
            onPress: () => router.push('/home/aiChat'),
          },
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  homeContent:{
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchLocationButton:{
    position: 'absolute',
    right: 20,
    top: 20
  },
  menu:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 25,
    marginBottom: 25,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
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
  tabChooser:{
    width: '100%'
  },
  tabArea: {
    width: '100%',
    minHeight: 200,
    paddingVertical: 15,
    marginVertical: 20,
  },
  mapInputs:{
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.7)',
    color: 'light-gray',
    borderWidth: 2,
  },
  kebab:{
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginLeft: 8
  }
});