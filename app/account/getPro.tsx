import Button from '@/components/Button';
import { BackButton } from '@/components/custom/BackButton';
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export default function GetProScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondary');

  return (
    <ThemedView style={{flex: 1, padding: 20, paddingTop: 210}}>
      <BackButton type='floating' />
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, height: 200}}>
        <LinearGradient
          colors={[secondaryColor, 'transparent']}
          style={{flex: 1, opacity: 0.5}}
        />
      </View>

      <View style={styles.titleContainer}>
        <ThemedText type='title'>
          Be a Pro Traveller!
        </ThemedText>
        <ThemedText type='defaultSemiBold'>
          Upgrade to enhance your experience
        </ThemedText>
      </View>

      <Button
        title="Get Pro"
        onPress={() => []}
        type="primary"
        buttonStyle={{ marginBottom: 40 }}
      />

      <View style={styles.featuresContainer}>
        <ThemedIcons library='MaterialDesignIcons' name='robot-excited' size={30}/>
        <ThemedText type='defaultSemiBold'>Unlimited TaraAI Conversations</ThemedText>
      </View>

      <View style={styles.featuresContainer}>
        <ThemedIcons library='MaterialIcons' name='auto-graph' size={30}/>
        <ThemedText type='defaultSemiBold'>Boost your Post Engagement</ThemedText>
      </View>

      <View style={styles.featuresContainer}>
        <ThemedIcons library='MaterialIcons' name='app-blocking' size={30}/>
        <ThemedText type='defaultSemiBold'>Enjoy TaraG Ads Free</ThemedText>
      </View>

      <View style={styles.featuresContainer}>
        <ThemedIcons library='MaterialDesignIcons' name='trophy-award' size={30}/>
        <ThemedText type='defaultSemiBold'>Exclusive Pro Traveller Badge</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 0,
    height: 500,
    zIndex: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    height: 30,
    width: '100%',
    gap: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
});