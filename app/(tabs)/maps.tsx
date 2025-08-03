
import TaraMap from '@/components/maps/TaraMap';
import { StyleSheet, View } from 'react-native';

export default function MapScreen() {
  return (
    <View style={{flex: 1}}>
      <TaraMap />
    </View>
  );
}

const styles = StyleSheet.create({
  
});