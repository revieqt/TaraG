import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import DropDownField from '@/components/DropDownField';
import Header from '@/components/Header';
import LocationAutocomplete, { LocationItem } from '@/components/LocationAutocomplete';
import TextField from '@/components/TextField';
import ThemedIcons from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ToggleButton from '@/components/ToggleButton';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const ITINERARY_TYPES = [
  { label: 'Solo', value: 'Solo' },
  { label: 'Group', value: 'Group' },
  { label: 'Family', value: 'Family' },
  { label: 'Business', value: 'Business' },
];

const GOOGLE_API_KEY = 'AIzaSyDI_dL8xl7gnjcPps-CXgDJM9DtF3oZPVI';

// Add types for location
interface DailyLocation {
  date: Date | null;
  locations: LocationItem[];
}

// Helper to generate days between two dates (inclusive)
function getDatesBetween(start: Date, end: Date): Date[] {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Helper to get the number of days between two dates (inclusive)
function getNumDays(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export default function CreateItineraryScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Solo');
  const [planDaily, setPlanDaily] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [locations, setLocations] = useState<LocationItem[]>([]); // For non-daily
  const [dailyLocations, setDailyLocations] = useState<DailyLocation[]>([]); // For daily: [{date, locations:[] }]
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [showAddLocation, setShowAddLocation] = useState<{[key: string]: boolean}>({}); // key: dayIdx or 'main'
  const [pendingLocation, setPendingLocation] = useState<{[key: string]: Partial<LocationItem>}>({});

  // Add a location to a day (fix: ensure dailyLocations is synced with autoDailyLocations)
  const addLocationToDay = (dayIdx: number, loc: LocationItem) => {
    // Find the date for this dayIdx in autoDailyLocations
    const dayDate = autoDailyLocations[dayIdx]?.date;
    if (!dayDate) return;
    // Find if this date already exists in dailyLocations
    let updated = [...dailyLocations];
    let idx = updated.findIndex(d => d.date && d.date.toDateString() === dayDate.toDateString());
    if (idx === -1) {
      // If not, add it
      updated.push({ date: dayDate, locations: [loc] });
    } else {
      // If yes, add location to that day
      updated[idx] = {
        ...updated[idx],
        locations: [...updated[idx].locations, loc],
      };
    }
    setDailyLocations(updated);
  };

  // Add a location for non-daily
  const addLocation = (loc: LocationItem) => {
    setLocations([...locations, loc]);
  };

  // Remove location (for both modes)
  const removeLocation = (dayIdx: number | null, locIdx: number) => {
    if (planDaily && dayIdx !== null) {
      const updated = [...dailyLocations];
      updated[dayIdx].locations.splice(locIdx, 1);
      setDailyLocations(updated);
    } else {
      const updated = [...locations];
      updated.splice(locIdx, 1);
      setLocations(updated);
    }
  };

  // Submit handler
  const handleSubmit = () => {
    if (!title.trim() || !startDate || !endDate) {
      Alert.alert('Missing Required Fields', 'Please enter a title, start date, and end date.');
      return;
    }
    const createdOn = new Date();
    let result = {
      title,
      description,
      type,
      createdOn: createdOn.toISOString(),
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      planDaily,
      locations: planDaily
        ? autoDailyLocations.map((d) => ({
            date: d.date ? d.date.toISOString() : null,
            locations:
              dailyLocations.find(dl => dl.date && d.date && dl.date.toDateString() === d.date.toDateString())?.locations || [],
          }))
        : locations,
    };
    setJsonResult(result);
  };

  // For daily plan, auto-generate days from startDate to endDate
  let autoDailyLocations: DailyLocation[] = dailyLocations;
  if (planDaily && startDate && endDate && startDate <= endDate) {
    const days = getDatesBetween(startDate, endDate);
    autoDailyLocations = days.map((date, idx) => {
      const existing = dailyLocations.find(d => d.date && d.date.toDateString() === date.toDateString());
      return existing || { date, locations: [] };
    });
  }

  // Calculate number of days between startDate and endDate
  const numDays = startDate && endDate ? getNumDays(startDate, endDate) : 0;

  // If only 1 day, force planDaily to false
  React.useEffect(() => {
    if (numDays <= 1 && planDaily) {
      setPlanDaily(false);
    }
  }, [numDays]);

  // Add location UI logic
  function renderAddLocationUI(dayIdx: number | null) {
    const key = dayIdx !== null ? String(dayIdx) : 'main';
    return (
      <ThemedView border='thin-gray' roundness={18} style={styles.addLocationContainer}>
        <LocationAutocomplete
          value={pendingLocation[key]?.locationName || ''}
          onSelect={loc => setPendingLocation(prev => ({ ...prev, [key]: { ...prev[key], ...loc } }))}
          placeholder="Location Name"
        />
        <TextField
          placeholder="Note (optional)"
          value={pendingLocation[key]?.note || ''}
          onChangeText={text => setPendingLocation(prev => ({ ...prev, [key]: { ...prev[key], note: text } }))}
        />
        <Button
          title="Add"
          onPress={() => {
            const loc = pendingLocation[key];
            if (loc && loc.locationName && loc.latitude && loc.longitude) {
              if (planDaily && dayIdx !== null) {
                addLocationToDay(dayIdx, { ...loc, note: loc.note || '' } as LocationItem);
              } else {
                addLocation({ ...loc, note: loc.note || '' } as LocationItem);
              }
              setShowAddLocation(prev => ({ ...prev, [key]: false }));
              setPendingLocation(prev => ({ ...prev, [key]: {} }));
            }
          }}
          buttonStyle={{ marginTop: 6 }}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header label="Create Itinerary" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TextField placeholder="Title" value={title} onChangeText={setTitle} />
          <TextField placeholder="Description" value={description} onChangeText={setDescription} />
          <DropDownField
            placeholder="Type"
            value={type}
            onValueChange={setType}
            values={ITINERARY_TYPES}
          />
          <View style={styles.rowBetween}>
            <DatePicker
              placeholder="Start Date"
              value={startDate}
              onChange={setStartDate}
              minimumDate={new Date()}
              maximumDate={endDate || undefined}
              style={{flex: 2}}
            />
            <DatePicker
              placeholder="End Date"
              value={endDate}
              onChange={setEndDate}
              minimumDate={startDate || new Date()}
              style={{flex: 2}}
            />
          </View>
          {/* Only show planDaily toggle if more than 1 day */}
          {numDays > 1 && (
            <ThemedView style={styles.rowBetween}>
              <ThemedText>Plan Daily?</ThemedText>
              <ToggleButton
                value="planDaily"
                label={planDaily ? 'Yes' : 'No'}
                initialSelected={planDaily}
                onToggle={(_, selected) => {
                  setPlanDaily(selected);
                  setDailyLocations([]);
                }}
              />
            </ThemedView>
          )}
          {planDaily ? (
            <ThemedView style={{ marginTop: 10 }}>
              <ThemedText type='subtitle' style={styles.sectionTitle}>Daily Plans</ThemedText>
              {autoDailyLocations.map((day, dayIdx) => (
                <ThemedView key={dayIdx} style={styles.dayBlock}>
                  <ThemedText style={{fontSize: 16, fontWeight: 'bold'}}>Day {dayIdx + 1}</ThemedText>
                  <ThemedText style={{opacity: 0.5, marginBottom: 10}}>({day.date?.toDateString()})</ThemedText>
                  {day.locations.map((loc, locIdx) => (
                    <ThemedView key={locIdx} style={styles.locationRow}>
                      <View style={{ flex: 1 }}>
                        <ThemedText>{loc.locationName}</ThemedText>
                        {loc.note ? (
                          <ThemedText style={styles.locationNote}>{loc.note}</ThemedText>
                        ) : null}
                      </View>
                      <TouchableOpacity onPress={() => removeLocation(dayIdx, locIdx)}>
                        <ThemedIcons library='MaterialIcons' name='close' size={20} color='red'/>
                      </TouchableOpacity>
                    </ThemedView>
                  ))}
                  {showAddLocation[String(dayIdx)] ? (
                    renderAddLocationUI(dayIdx)
                  ) : (
                    <TouchableOpacity style={styles.addLocationButton} onPress={() => setShowAddLocation(prev => ({ ...prev, [String(dayIdx)]: true }))}>
                      <ThemedIcons library='MaterialIcons' name='add-circle-outline' size={20} color='#008000'/>
                      <ThemedText style={styles.addLocationText}>Add Location</ThemedText>
                    </TouchableOpacity>
                  )}
                </ThemedView>
              ))}
            </ThemedView>
          ) : (
            <ThemedView style={{ marginTop: 10 }}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Locations</ThemedText>
              {locations.map((loc, idx) => (
                <View key={idx} style={styles.locationRow}>
                  <View style={{ flex: 1 }}>
                    <ThemedText>{loc.locationName}</ThemedText>
                    {loc.note ? (
                      <ThemedText style={styles.locationNote}>{loc.note}</ThemedText>
                    ) : null}
                  </View>
                  <TouchableOpacity onPress={() => removeLocation(null, idx)}>
                    <ThemedIcons library='MaterialIcons' name='close' size={20} color='red'/>
                  </TouchableOpacity>
                </View>
              ))}
              {showAddLocation['main'] ? (
                renderAddLocationUI(null)
              ) : (
                <TouchableOpacity style={styles.addLocationButton} onPress={() => setShowAddLocation(prev => ({ ...prev, main: true }))}>
                  <ThemedIcons library='MaterialIcons' name='add-circle-outline' size={20} color='#008000'/>
                  <ThemedText style={styles.addLocationText}>Add Location</ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          )}
          <Button
            title="Create Itinerary"
            onPress={handleSubmit}
            buttonStyle={{ marginTop: 20 }}
            disabled={!title.trim() || !startDate || !endDate}
          />
          {jsonResult && (
            <View style={styles.jsonBox}>
              <ThemedText style={styles.sectionTitle}>Generated JSON</ThemedText>
              <ThemedText style={{ fontSize: 12, color: '#333' }}>{JSON.stringify(jsonResult, null, 2)}</ThemedText>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 5,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 10,
  },
  dayBlock: {
    padding: 12,
    marginBottom: 12,
    borderColor: "#00CAFF",
    borderLeftWidth: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 100,
    maxHeight: 180,
  },
  dropdownItemBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownItem: {
    fontSize: 15,
    color: '#222',
  },
  jsonBox: {
    backgroundColor: '#f3f3f7',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  locationNote: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  addLocationButton:{
    borderColor: 'transparent',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10
  },
  addLocationText:{
    color: '#008000',
    fontWeight: 'bold'
  },
  addLocationContainer:{
    padding: 10
  }
});