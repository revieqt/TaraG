import BackButton from '@/components/custom/BackButton';
import ProBadge from '@/components/custom/ProBadge';
import ViewImageModal from '@/components/custom/ViewImage';
import GradientHeader from '@/components/GradientHeader';
import HorizontalSections from '@/components/HorizontalSections';
import OptionsPopup from '@/components/OptionsPopup';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/SessionContext';
import useChangeProfileImage from '@/hooks/useChangeProfileImage';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';


export default function ProfileScreen() {
  const { userId } = useLocalSearchParams();
  const { session } = useSession();
  const sessionUser = session?.user;
  
  let user = sessionUser;
  let isCurrentUser = true;
  const userType = (user?.type === "traveler") ? "Traveler" : ((user?.type === "tourGuide") ? "Tour Guide" : "Admin");
  const userDescription = ((user?.isProUser) ? "Pro" : "Basic") + " " + userType;

  // If userId is provided and does not match session user, prepare to fetch from Firebase (not implemented yet)
  if (userId && userId !== sessionUser?.id) {
    // TODO: Fetch user from Firebase by userId
    user = undefined; // Placeholder for fetched user
    isCurrentUser = false;
  }

  const [viewImageVisible, setViewImageVisible] = useState(false);
  const changeProfileImage = useChangeProfileImage();

  return (
    <ThemedView style={{flex:1}}>
      <ScrollView style={{flex:1}}>
        <ThemedView color='primary'>
          <View style={styles.header}>
            <BackButton/>
            { isCurrentUser && (
              <OptionsPopup
                key="options"
                options={[
                  
                ]}
              >
                <ThemedIcons
                  library="MaterialCommunityIcons"
                  name="dots-vertical"
                  size={24}
                />
              </OptionsPopup>
            )}
          </View>
          <GradientHeader/>
          
          {user && (
            <OptionsPopup
              style={styles.profileImage}
            >
              <Image
                source={{ uri: session?.user?.profileImage || 'https://ui-avatars.com/api/?name=User' }}
                style={{flex: 1}}
              />
            </OptionsPopup>
          )}
          <ViewImageModal
            visible={viewImageVisible}
            imageUrl={user?.profileImage || ''}
            onClose={() => setViewImageVisible(false)}
          />

          <View style={{marginTop: 120, alignItems: 'center'}}>
            {user ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <ThemedText type="subtitle">{user.fname} {user.mname ? user.mname : ''}{user.lname}</ThemedText>
                  <ProBadge/>
                </View>
                
                <ThemedText type="defaultSemiBold" style={{opacity: .5}}>@{user.username}</ThemedText>
                <ThemedText style={{opacity: .5, marginBottom: 10}}>{userDescription}</ThemedText>
              </>
              ) : (
                <ThemedText type="error">User not found.</ThemedText>
              )
            }
          </View>

          <View style={styles.bio}>
            {(user?.bio?.trim() !== "") && (
              <ThemedText>{user?.bio}</ThemedText>
            )}
            { isCurrentUser && (
              <TouchableOpacity style={styles.editBio}>
                <ThemedIcons library="MaterialIcons" name="edit" size={15}/>
                <ThemedText>Edit Bio</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </ThemedView>
        
        <HorizontalSections
          labels={['Travels', 'About']}
          type="fullTab"
          containerStyle={{ flex: 1}}
          sections={[
          <View key="travels" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 1000}}>
            <View>
            </View>
          </View>,
          <View key="about" style={{ flex: 1, padding: 20}}>
            {user ? (
              <>
                <ThemedText>Email: {user.email}</ThemedText>
                <ThemedText>Age: {user.age}</ThemedText>
                <ThemedText>Gender: {user.gender}</ThemedText>
                <ThemedText>Contact Number: {user.contactNumber}</ThemedText>
                <ThemedText>Status: {user.status}</ThemedText>
                <ThemedText>Type: {user.type}</ThemedText>
              </>
            ) : (
              <ThemedText type="error">User not found.</ThemedText>
            )}
          </View>]}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    zIndex: 100
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
    alignSelf: 'center',
    position: 'absolute',
    marginTop: -20,
    zIndex: 100,
    overflow: 'hidden',
  },
  bio:{
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  editBio: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:5,
    paddingHorizontal: 10,
    borderRadius: 30,
    backgroundColor: '#ccc4',
  }
});