import { BackButton } from '@/components/custom/BackButton';
import GradientMeshBackground from '@/components/GradientMeshBackground';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

export default function AlertView() {
  let fadeColor = 'red';
  let title = 'Be Alert';
  let subtitle = 'You might be in a typhoon\'s path';
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <ThemedView style={{flex: 1, padding: 20}}>
      <BackButton type='floating' />
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, height: 200}}>
        <GradientMeshBackground/>
        <LinearGradient
          colors={[fadeColor, 'transparent']}
          style={{flex: 1, opacity: 0.5}}
        />
      </View>

      <Image
        source={require('@/assets/images/tara-worried.png')}
        style={styles.taraWorried}
      />

      <View style={{position: 'absolute', top:110, left: 0, right: 0, height: 500, zIndex: 10}}>
        <LinearGradient
          colors={['transparent', backgroundColor]}
          style={{width: '100%', height: 120}}
        />
        <View style={{position: 'absolute', top: 120, left: 0, right: 0, height: 500, backgroundColor: backgroundColor}}/>
          
      </View>

      <View style={styles.titleContainer}>
        <ThemedText type='title'>
          {title}
        </ThemedText>
        <ThemedText type='defaultSemiBold'>
          {subtitle}
        </ThemedText>
      </View>

      <ThemedText style={{marginTop: 200, zIndex: 10}}>
        hjsadkuashfduhsaufygsdayufgsdauyfgsdayufgsduigfyudsgafyudgfuysgfiuaygyudgauyfguydgufaygduyfagdauyfgsaduyfgyusdagfyu
      </ThemedText>
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
  taraWorried:{
    position: 'absolute',
    top: 20,
    right: -27,
    width: 150,
    height: 300,
    resizeMode: 'contain',
    zIndex: 4,
  }
});