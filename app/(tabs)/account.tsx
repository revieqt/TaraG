import Button from '@/components/Button';
import GradientHeader from '@/components/GradientHeader';
import { BACKEND_URL } from '@/constants/Config';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import WebViewModal from '@/components/WebView';
import { SUPPORT_FORM_URL } from '@/constants/Config';
import { useSession } from '@/context/SessionContext';
import { fetchDocument } from '@/services/documentsApiService';
import { auth } from '@/services/firebaseConfig';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import ProBadge from '@/components/custom/ProBadge';
import { TRAVELLER_PRO_PRICE } from '@/constants/Config';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  const { session, clearSession } = useSession();
  const user = session?.user;
  const [showPayment, setShowPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const [showSupport, setShowSupport] = useState(false);

  const fullName = [user?.fname, user?.mname, user?.lname].filter(Boolean).join(' ');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await clearSession();
      router.replace('/auth/login');
    } catch (err) {
      Alert.alert('Logout Failed', 'An error occurred while logging out.');
    }
  };
  
  const handlePayPro = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/pay/traveller-pro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data?.data?.attributes?.checkout_url) {
        setPaymentUrl(data.data.attributes.checkout_url);
        setShowPayment(true);
      } else {
        Alert.alert("Error", "Failed to get payment link.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to start payment.");
    }
  };
  // Helper to load a document and navigate
  const openDocument = async (docName: 'terms-mobileApp' | 'privacyPolicy-mobileApp' | 'manual-mobileApp') => {
    try {
      const doc = await fetchDocument(docName);
      router.push({
        pathname: '/account/info-view',
        params: { data: JSON.stringify(doc) }, // pass JSON as string
      });
    } catch (error) {
      Alert.alert('Error', `Failed to load ${docName}.`);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <GradientHeader/>
      <ScrollView
        style={{ width: '100%', zIndex: 1000}}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
      >
        {/* User Header */}
        <ThemedView shadow color='primary' style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() =>
              router.push({
                pathname: '/account/viewProfile',
                params: { userId: user?.id },
              })
            }
          >
            <Image
              source={{ uri: session?.user?.profileImage || 'https://ui-avatars.com/api/?name=User' }}
              style={styles.profileImage}
            />
            <View style={{ justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ThemedText type='defaultSemiBold'>{fullName}</ThemedText>
                <ProBadge/>
              </View>
              <ThemedText>@{user?.username}</ThemedText>
            </View>
            <View style={{ position: 'absolute', right: 0 }}>
              <ThemedIcons library='MaterialIcons' name='arrow-forward-ios' size={20} />
            </View>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView color='primary' shadow style={styles.proContainer}>
          {!user?.isProUser ? (
            <>
              <ThemedText type='subtitle' style={{fontSize: 17, color: 'skyblue'}}>Basic Traveler</ThemedText>
              <ThemedText style={{textAlign: 'center', opacity: .5, marginBottom: 10}}>Unlock the full TaraG experience. Get TaraG Pro for as low as ${TRAVELLER_PRO_PRICE}/month</ThemedText>
              <Button
                title='Get TaraG Pro'
                type='primary'
                onPress={handlePayPro}
                buttonStyle={{
                  width: '100%',
                  marginBottom: 15,
                }}
              />
            </>
          ) : (
            <>
              <ThemedText type='subtitle' style={{fontSize: 17, color: 'orange'}}>Pro User</ThemedText>
              <ThemedText style={{textAlign: 'center', opacity: .5, marginBottom: 10}}>You have access to all features. Thank you for supporting TaraG!</ThemedText>
            </>
          )}
          <View style={styles.featuresContainer}>
            <ThemedIcons library='MaterialDesignIcons' name='robot-excited' size={25}/>
            <ThemedText>Unlimited TaraAI Conversations</ThemedText>
          </View>
    
          <View style={styles.featuresContainer}>
            <ThemedIcons library='MaterialIcons' name='auto-graph' size={25}/>
            <ThemedText>Boost your Post Engagement</ThemedText>
          </View>
    
          <View style={styles.featuresContainer}>
            <ThemedIcons library='MaterialIcons' name='app-blocking' size={25}/>
            <ThemedText>Enjoy TaraG Ads Free</ThemedText>
          </View>
    
          <View style={styles.featuresContainer}>
            <ThemedIcons library='MaterialDesignIcons' name='trophy-award' size={25}/>
            <ThemedText>Exclusive Pro Traveller Badge</ThemedText>
          </View>
        </ThemedView>
        {/* Options */}
        <View style={styles.options}>
          <ThemedText style={styles.optionsTitle} type='defaultSemiBold'>
            Privacy and Security
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.push('/auth/changePassword')}
            style={styles.optionsChild}
          >
            <ThemedIcons library='MaterialIcons' name='vpn-key' size={15} />
            <ThemedText>Change Password</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openDocument('privacyPolicy-mobileApp')} style={styles.optionsChild}>
            <ThemedIcons library='MaterialDesignIcons' name='file-eye' size={15} />
            <ThemedText>Privacy Policy</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openDocument('terms-mobileApp')} style={styles.optionsChild}>
            <ThemedIcons library='MaterialDesignIcons' name='file-alert' size={15} />
            <ThemedText>Terms and Conditions</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.optionsTitle} type='defaultSemiBold'>
            Help and Support
          </ThemedText>
          <TouchableOpacity onPress={() => openDocument('manual-mobileApp')} style={styles.optionsChild}>
            <ThemedIcons library='MaterialDesignIcons' name='file-find' size={15} />
            <ThemedText>App Manual</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSupport(true)} style={styles.optionsChild}>
            <ThemedIcons library='MaterialDesignIcons' name='headset' size={15} />
            <ThemedText>Contact Support</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button
          title='Logout'
          onPress={handleLogout}
          type='primary'
          buttonStyle={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </ScrollView>

      {/* Support Modal */}
      <WebViewModal
        visible={showSupport}
        onClose={() => setShowSupport(false)}
        uri={SUPPORT_FORM_URL}
      />

      <WebViewModal
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        uri={paymentUrl || ""}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    marginTop: 30,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
    marginRight: 16,
  },
  options: {
    gap: 10,
    width: '100%',
  },
  optionsTitle: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  optionsChild: {
    padding: 10,
    fontSize: 15,
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    marginVertical: 30,
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  closeButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    alignItems: 'center',
  },
  proContainer:{
    width: '100%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    padding: 5,
    width: '100%',
    gap: 20,
    alignItems: 'center',
  },
});
