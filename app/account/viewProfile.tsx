import GradientHeader from '@/components/GradientHeader';
import OptionsPopup from '@/components/OptionsPopup';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BackButton from '@/components/custom/BackButton';
import ViewImageModal from '@/components/custom/ViewImage';
import { useSession } from '@/context/SessionContext';
import useChangeProfileImage from '@/hooks/useChangeProfileImage';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ProBadge from '@/components/custom/ProBadge';


export default function ProfileScreen() {
  const { userId } = useLocalSearchParams();
  const { session } = useSession();
  const sessionUser = session?.user;
  let user = sessionUser;
  let isCurrentUser = true;

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
      <ThemedView color='primary'>
        <BackButton style={styles.backButton}/>
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

        <View style={{marginTop: 200, alignItems: 'center'}}>
          {
            user ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <ThemedText type="subtitle">{user.fname} {user.mname ? user.mname : ''}{user.lname}</ThemedText>
                  <ProBadge/>
                </View>
                
                <ThemedText type="defaultSemiBold">@{user.username}</ThemedText>
              </>
            ) : (
              <ThemedText type="error">User not found.</ThemedText>
            )
          }
        </View>
      </ThemedView>
      
      <View style={{paddingHorizontal: 20, paddingTop: 5}}>
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
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backButton:{
    position: 'absolute',
    zIndex: 100,
    top: 16,
    left: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
    alignSelf: 'center',
    marginTop: 65,
    position: 'absolute',
    zIndex: 100,
    overflow: 'hidden',
  },
  content:{

  }
});