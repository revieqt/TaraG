import Button from '@/components/Button';
import ContactNumberField from '@/components/ContactNumberField';
import BackButton from '@/components/custom/BackButton';
import SOSButton from '@/components/custom/SOSButton';
import GradientHeader from '@/components/GradientHeader';
import HorizontalSections from '@/components/HorizontalSections';
import TextField from '@/components/TextField';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import { BACKEND_URL } from '@/constants/Config';
import { useLocation } from '@/hooks/useLocation';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width } = Dimensions.get('window');

export default function SafetyScreen() {
  const { session, updateSession } = useSession();
  const user = session?.user;
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formAreaCode, setFormAreaCode] = useState('63+');
  const [formNumber, setFormNumber] = useState('');
  const [formIndex, setFormIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');

  const emergencyContact = user?.emergencyContact && user.emergencyContact.length > 0 ? user.emergencyContact[0] : null;

  const { latitude, longitude, loading: locationLoading, error: locationError } = useLocation();

  const [amenities, setAmenities] = useState<any[]>([]);
  const [amenityLoading, setAmenityLoading] = useState(false);
  const [amenityError, setAmenityError] = useState<string | null>(null);

  const fetchAmenities = async (amenityType: string) => {
    if (!latitude || !longitude) {
      setAmenityError('Location not available.');
      return;
    }
    setAmenityLoading(true);
    setAmenityError(null);
    setAmenities([]);
    
    console.log('Fetching amenities:', { amenityType, latitude, longitude });
    
    try {
      const requestBody = { 
        amenity: amenityType, 
        latitude, 
        longitude 
      };
      
      console.log('Request body:', requestBody);
      console.log('Request URL:', `${BACKEND_URL}/emergency/nearest`);
      
      const res = await fetch(`${BACKEND_URL}/emergency/nearest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch amenities: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log('Response data:', data);
      setAmenities(data);
    } catch (err: any) {
      console.error('Fetch amenities error:', err);
      setAmenityError(`Could not fetch emergency services: ${err.message}`);
    } finally {
      setAmenityLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    const newContact = { name: formName, contactNumber: formAreaCode + formNumber };
    let updatedContacts = user?.emergencyContact ? [...user.emergencyContact] : [];
    let method: 'POST' | 'PUT' = formIndex !== null ? 'PUT' : 'POST';
    let url = `${process.env.EXPO_PUBLIC_API_URL || 'https://tarag-backend.onrender.com/api'}/users/${user?.id}/emergency-contact`;
    let body: any;
    if (formIndex !== null && updatedContacts[formIndex]) {
      updatedContacts[formIndex] = newContact;
      body = { emergencyContact: updatedContacts };
    } else {
      updatedContacts = [newContact];
      body = { contact: newContact };
    }
    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to save emergency contact');
      await updateSession({ user: { ...(user as any), emergencyContact: updatedContacts } });
      setShowForm(false);
    } catch (err) {
      alert('Failed to save emergency contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setFormName('');
    setFormAreaCode('63+');
    setFormNumber('');
    setFormIndex(null);
    setShowForm(true);
  };

  const openUpdateForm = () => {
    if (!emergencyContact) return;
    const match = emergencyContact.contactNumber.match(/^(\d+\+)(.*)$/);
    setFormName(emergencyContact.name);
    if (match) {
      setFormAreaCode(match[1]);
      setFormNumber(match[2]);
    } else {
      setFormAreaCode('63+');
      setFormNumber(emergencyContact.contactNumber);
    }
    setFormIndex(0);
    setShowForm(true);
  };

  const renderAmenityCard = (amenity: any, index: number) => (
    <ThemedView key={amenity.id || index} color='primary' shadow style={styles.amenityCard}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: amenity.latitude,
            longitude: amenity.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: amenity.latitude,
              longitude: amenity.longitude,
            }}
            title={amenity.name}
          />
        </MapView>
      </View>
      
      {/* Info Section */}
      <View style={{padding: 16}}>
        <ThemedText type="defaultSemiBold" style={{marginBottom: 8}}>
          {amenity.name}
        </ThemedText>
        
        {amenity.address && (
          <View style={styles.infoRow}>
            <ThemedIcons library="MaterialIcons" name="location-on" size={16}/>
            <ThemedText numberOfLines={2}>
              {amenity.address}
            </ThemedText>
          </View>
        )}
        
        {amenity.phone && (
          <View style={styles.infoRow}>
            <ThemedIcons library="MaterialIcons" name="phone" size={16}/>
            <ThemedText>
              {amenity.phone}
            </ThemedText>
          </View>
        )}
        
        {amenity.website && (
          <View style={styles.infoRow}>
            <ThemedIcons library="MaterialIcons" name="language" size={16}/>
            <ThemedText numberOfLines={1}>
              {amenity.website}
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={{flex:1}}>
      <BackButton style={styles.backButton}/>
      <ThemedView color='primary'>
        <GradientHeader/>
        <View style={styles.header}>
          <SOSButton/>
          <View style={{ justifyContent: 'center'}}>
            <ThemedText type='subtitle'>Emergency State</ThemedText>
            <ThemedText type='defaultSemiBold'>Safety Mode</ThemedText>
          </View>
        </View>
      </ThemedView>
      <HorizontalSections
        labels={['Help Finder', 'Emergency Contact']}
        type="fullTab"
        containerStyle={{ flex: 1 }}
        sections={[
        <View key="help" style={{ flex: 1 }}>
            <ThemedText style={{textAlign: 'center', paddingTop: 20}}>
              Who do you need to reach in your emergency?
            </ThemedText>
          
          <LinearGradient
            colors={[backgroundColor,backgroundColor,backgroundColor, 'transparent']}
            style={styles.helpMenuGradient}
          />
          <View style={styles.helpMenu}>
            
              <ThemedView shadow color='primary' style={styles.helpButton}>
                <TouchableOpacity 
                  style={styles.helpButtonContent} 
                  onPress={() => fetchAmenities('hospital')}
                  disabled={locationLoading}
                >
                  <ThemedIcons library='MaterialIcons' name='local-hospital' size={30} color='red'/>
                </TouchableOpacity>
              </ThemedView>
              <ThemedView shadow color='primary' style={styles.helpButton}>
                <TouchableOpacity 
                  style={styles.helpButtonContent} 
                  onPress={() => fetchAmenities('police')}
                  disabled={locationLoading}
                >
                  <ThemedIcons library='MaterialIcons' name='local-police' size={30} color='blue'/>
                </TouchableOpacity>
              </ThemedView>
              <ThemedView shadow color='primary' style={styles.helpButton}>
                <TouchableOpacity 
                  style={styles.helpButtonContent} 
                  onPress={() => fetchAmenities('fire_station')}
                  disabled={locationLoading}
                >
                  <ThemedIcons library='MaterialIcons' name='local-fire-department' size={30} color='orange'/>
                </TouchableOpacity>
              </ThemedView>
          </View>

          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {locationLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4300FF" />
              </View>
            )}
            
            {locationError && (
              <View style={styles.errorContainer}>
                <ThemedText type="error">{locationError}</ThemedText>
              </View>
            )}
            
            {amenityLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4300FF" />
              </View>
            )}
            
            {amenityError && (
              <View style={styles.errorContainer}>
                <ThemedText type="error">{amenityError}</ThemedText>
              </View>
            )}
            
            {amenities.length > 0 && (
              <View style={styles.amenitiesContainer}>
                {amenities.map((amenity, index) => renderAmenityCard(amenity, index))}
              </View>
            )}
          </ScrollView>
        </View>,
        <View key="contact" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText type='subtitle'>Emergency Contact</ThemedText>
          <ThemedText style={{opacity: 0.5}}>Look for the nearest help</ThemedText>
          {emergencyContact ? (
            <View style={[styles.settingsRow, { alignItems: 'center', marginTop: 10 }]}> 
              <View>
                <ThemedText type='defaultSemiBold'>{emergencyContact.name}</ThemedText>
                <ThemedText>{emergencyContact.contactNumber}</ThemedText>
              </View>
              <Button title="Update" onPress={openUpdateForm} buttonStyle={{ height: 36, paddingHorizontal: 16 }} />
            </View>
          ) : (
            <Button title="Add Emergency Contact" onPress={openAddForm} buttonStyle={{ marginTop: 10 }} />
          )}
          {showForm && (
            <View style={{ marginTop: 16, backgroundColor: '#fff2', borderRadius: 10, padding: 16 }}>
              <TextField
                placeholder="Contact Name"
                value={formName}
                onChangeText={setFormName}
              />
              <ContactNumberField
                areaCode={formAreaCode}
                onAreaCodeChange={setFormAreaCode}
                number={formNumber}
                onNumberChange={setFormNumber}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                <Button title="Cancel" onPress={() => setShowForm(false)} type="outline" buttonStyle={{ marginRight: 8 }} />
                <Button title={formIndex !== null ? 'Update' : 'Add'} onPress={handleAddOrUpdate} type="primary" loading={loading} />
              </View>
            </View>
          )}
        </View>]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    zIndex: 10,
    marginTop: 50,
    flexDirection: 'row',
    gap: 15
  },
  backButton:{
    position: 'absolute',
    zIndex: 100,
    top: 16,
    left: 16,
  },
  helpMenu:{
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  helpButton:{
    padding: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  helpButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  scrollContent: {
    marginTop: 10,
    paddingTop: 80,
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  amenitiesContainer: {
    marginTop: 10,
  },
  amenityCard: {
    margin: 10,
    borderRadius: 12,
    borderColor: '#ccc4',
    borderWidth: 1,
  },
  mapContainer: {
    height: 150,
    width: '100%',
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 6,
    gap: 8,
    opacity: 0.5,
  },
  settingsRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpMenuGradient: {
    width: '100%',
    height: 110,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 100,
  },
});