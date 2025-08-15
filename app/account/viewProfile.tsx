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
      <BackButton style={styles.backButton}/>
      {user && (
        <OptionsPopup
          actions={[
            {
              label: 'View Profile',
              onPress: () => setViewImageVisible(true),
            },
            ...(isCurrentUser ? [{
              label: 'Change Profile',
              onPress: async () => {
                await changeProfileImage();
              },
            }] : []),
          ]}
          style={styles.profileImage}
        >
          <Image
            source={user.profileImage ? { uri: user.profileImage } : require('@/assets/images/defaultUser.jpg')}
            style={{flex:1}}
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
              <ThemedText type="subtitle">{user.fname} {user.mname ? user.mname : ''}{user.lname}</ThemedText>
              <ThemedText type="defaultSemiBold">@{user.username}</ThemedText>
            </>
          ) : (
            <ThemedText type="error">User not found.</ThemedText>
          )
        }
      </View>
      <View style={{paddingHorizontal: 20, paddingTop: 5}}>
        {user ? (
          <>
            <ThemedText>Email: {user.email}</ThemedText>
            <ThemedText>Age: {user.age}</ThemedText>
            <ThemedText>Gender: {user.gender}</ThemedText>
            <ThemedText>Contact Number: {user.contactNumber}</ThemedText>
            <ThemedText>Status: {user.status}</ThemedText>
            <ThemedText>Type: {user.type}</ThemedText>
            {user.emergencyContact && user.emergencyContact.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <ThemedText type="subtitle">Emergency Contacts:</ThemedText>
                {user.emergencyContact.map((ec, idx) => (
                  <ThemedText key={idx}>- {ec.name}: {ec.contactNumber}</ThemedText>
                ))}
              </View>
            )}
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