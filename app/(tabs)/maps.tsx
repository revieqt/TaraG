
import { ThemedIcons } from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {StyleSheet} from 'react-native';

export default function MapScreen() {
  

  return (
    <ThemedView style={{flex: 1}}>
      
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