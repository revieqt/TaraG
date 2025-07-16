import TextField from '@/components/TextField';
import ThemedIcons from '@/components/ThemedIcons';
import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

const GOOGLE_API_KEY = 'AIzaSyDI_dL8xl7gnjcPps-CXgDJM9DtF3oZPVI';

export interface LocationItem {
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  note: string;
}

interface LocationAutocompleteProps {
  value: string;
  onSelect: (loc: LocationItem) => void;
  placeholder: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ value, onSelect, placeholder }) => {
  const [input, setInput] = useState<string>(value || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchSuggestions = async (text: string) => {
    setInput(text);
    if (!text) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();
      setSuggestions(data.predictions || []);
      setShowDropdown(true);
    } catch (e) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (item: any) => {
    setInput(item.description);
    setShowDropdown(false);
    // Fetch place details for lat/lng
    const detailsRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=geometry&key=${GOOGLE_API_KEY}`
    );
    const details = await detailsRes.json();
    const loc = details.result?.geometry?.location;
    onSelect({
      locationName: item.description,
      latitude: loc?.lat || null,
      longitude: loc?.lng || null,
      note: '',
    });
  };

  return (
    <View style={{ zIndex: 10 }}>
      <TextField
        placeholder={placeholder}
        value={input}
        onChangeText={fetchSuggestions}
        onFocus={() => setShowDropdown(!!input)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && (
        <View style={styles.dropdown}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : suggestions.length === 0 ? (
            <ThemedText style={styles.dropdownItem}>No results</ThemedText>
          ) : (
            suggestions.map((item) => (
              <TouchableOpacity
                key={item.place_id}
                onPress={() => handleSelect(item)}
                style={styles.dropdownItemBtn}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ThemedIcons library="MaterialIcons" name="place" size={18} color="#008000" />
                  <ThemedText style={[styles.dropdownItem, { marginLeft: 6 }]}>{item.description}</ThemedText>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownItem: {
    fontSize: 15,
    color: '#222',
  },
});

export default LocationAutocomplete; 