import Header from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import DropDownField from '@/components/DropDownField';

export default function WeatherScreen() {
  const PH_CITIES = [
    { label: 'Manila', value: 'Manila', lat: 14.5995, lon: 120.9842 },
    { label: 'Quezon City', value: 'Quezon City', lat: 14.6760, lon: 121.0437 },
    { label: 'Cebu City', value: 'Cebu City', lat: 10.3157, lon: 123.8854 },
    { label: 'Davao City', value: 'Davao City', lat: 7.1907, lon: 125.4553 },
    { label: 'Baguio', value: 'Baguio', lat: 16.4023, lon: 120.5960 },
    { label: 'Iloilo City', value: 'Iloilo City', lat: 10.7202, lon: 122.5621 },
    { label: 'Bacolod', value: 'Bacolod', lat: 10.6765, lon: 122.9509 },
    { label: 'Cagayan de Oro', value: 'Cagayan de Oro', lat: 8.4542, lon: 124.6319 },
    { label: 'Zamboanga City', value: 'Zamboanga City', lat: 6.9214, lon: 122.0790 },
    { label: 'Tagaytay', value: 'Tagaytay', lat: 14.1001, lon: 120.9830 },
    { label: 'General Santos', value: 'General Santos', lat: 6.1164, lon: 125.1716 },
    { label: 'Angeles City', value: 'Angeles City', lat: 15.1473, lon: 120.5849 },
    { label: 'Legazpi', value: 'Legazpi', lat: 13.1391, lon: 123.7438 },
    { label: 'Puerto Princesa', value: 'Puerto Princesa', lat: 9.7392, lon: 118.7353 },
    { label: 'Dumaguete', value: 'Dumaguete', lat: 9.3068, lon: 123.3054 },
  ];
  const [selectedCity, setSelectedCity] = useState<typeof PH_CITIES[0] | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (!selectedCity) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const response = await fetch(
        `https://tarag-backend.onrender.com/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather');
      }
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{flex:1, padding: 16}}>
      <Header label='Weather'/>
      <DropDownField
        placeholder="Select a city"
        value={selectedCity ? selectedCity.value : ''}
        onValueChange={val => {
          const city = PH_CITIES.find(c => c.value === val) || null;
          setSelectedCity(city);
        }}
        values={PH_CITIES}
        style={{ marginBottom: 12 }}
      />
      <Button title="Get Weather" onPress={fetchWeather} disabled={loading || !selectedCity} />
      {loading && <ThemedText style={{ marginTop: 16 }}>Loading...</ThemedText>}
      {error && <ThemedText style={{ color: 'red', marginTop: 16 }}>{error}</ThemedText>}
      {weather && (
        <View style={{ marginTop: 24 }}>
          <ThemedText type="subtitle">Weather for {selectedCity?.label}</ThemedText>
          <ThemedText>Temperature: {weather.temp}°C</ThemedText>
          <ThemedText>Description: {weather.description}</ThemedText>
          {/* Add more weather details as needed */}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
});