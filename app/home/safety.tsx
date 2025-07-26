import { ThemedView } from '@/components/ThemedView';
import CollapsibleHeader from '@/components/CollapsibleHeader';
import { ThemedIcons } from '@/components/ThemedIcons';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity} from 'react-native';
import BackButton from '@/components/custom/BackButton';
import SOSButton from '@/components/custom/SOSButton';
import { ThemedText } from '@/components/ThemedText';
import GradientMeshBackground from '@/components/GradientMeshBackground';
import OptionsPopup from '@/components/OptionsPopup';
import { useSession } from '@/context/SessionContext';
import TextField from '@/components/TextField';
import ContactNumberField from '@/components/ContactNumberField';
import Button from '@/components/Button';


export default function SafetyScreen() {
  const { session, updateSession } = useSession();
  const user = session?.user;
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formAreaCode, setFormAreaCode] = useState('63+');
  const [formNumber, setFormNumber] = useState('');
  const [formIndex, setFormIndex] = useState<number | null>(null); // null = add, number = update
  const [loading, setLoading] = useState(false);

  const emergencyContact = user?.emergencyContact && user.emergencyContact.length > 0 ? user.emergencyContact[0] : null;

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
    // Try to split area code and number
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

  return (
    <ThemedView style={{flex:1}}>
      <BackButton style={styles.backButton}/>
      <CollapsibleHeader disableExpand defaultHeight={210}>
        <GradientMeshBackground gradientBackground/>
        <View style={styles.header}>
          <SOSButton/>
          <View style={{height: '100%', justifyContent: 'center'}}>
            <ThemedText type='subtitle'>Emergency State</ThemedText>
            <ThemedText type='defaultSemiBold'>Safety Mode</ThemedText>
          </View>
        </View>
      </CollapsibleHeader>
      <View style={{paddingHorizontal: 20, paddingTop: 5}}>
        <ThemedText type='subtitle'>Help Finder</ThemedText>
        <ThemedText style={{opacity: 0.5}}>Look for the nearest help</ThemedText>
        <View style={styles.helpMenu}>
          <ThemedView shadow style={[{borderColor: 'red', borderWidth: 2},styles.helpButton]}>
            <TouchableOpacity style={styles.helpButtonContent}>
              <ThemedIcons library='MaterialIcons' name='local-hospital' size={20}/>
              <ThemedText>Hospitals</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView shadow style={[{borderColor: 'blue', borderWidth: 2},styles.helpButton]}>
            <TouchableOpacity style={styles.helpButtonContent}>
              <ThemedIcons library='MaterialIcons' name='local-police' size={20}/>
              <ThemedText>Police Station</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView shadow style={[{borderColor: 'orange', borderWidth: 2},styles.helpButton]}>
            <TouchableOpacity style={styles.helpButtonContent}>
              <ThemedIcons library='MaterialIcons' name='local-fire-department' size={20}/>
              <ThemedText>Fire Station</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView shadow style={[{borderColor: 'green', borderWidth: 2},styles.helpButton]}>
            <TouchableOpacity style={styles.helpButtonContent}>
              <ThemedIcons library='MaterialIcons' name='supervised-user-circle' size={20}/>
              <ThemedText>Tourist Desk</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
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
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 70,
    position: 'absolute',
    zIndex: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: 15,
  },
  helpButton:{
    width: "48%",
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  helpButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  settingsRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});