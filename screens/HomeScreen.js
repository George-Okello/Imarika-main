import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Text,
  StatusBar,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation'; // Import Geolocation
import { fetchHourlyWeatherByCoords, fetchDailyWeatherByCoords } from '../api/weather';
import Forecast from '../components/Forecast';

export default function HomeScreen() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [dailyWeather, setDailyWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Request permission to access location
        Geolocation.requestAuthorization();

        // Get the user's current location
        Geolocation.getCurrentPosition(
          async (position) => {
            const receivedLatitude = position.coords.latitude;
            const receivedLongitude = position.coords.longitude;

            setLatitude(receivedLatitude);
            setLongitude(receivedLongitude);

            // Fetch weather data based on the obtained coordinates
            const dailyData = await fetchDailyWeatherByCoords(receivedLatitude, receivedLongitude);
            setDailyWeather(dailyData);

            const hourlyData = await fetchHourlyWeatherByCoords(receivedLatitude, receivedLongitude);
            setHourlyWeather(hourlyData);
            setLoading(false);
          },
          (error) => {
            setError('Error getting location: ' + error.message);
            setLoading(false);
          }
        );
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image 
        blurRadius={70} 
        source={require('../assets/Background.jpg')} 
        className="absolute w-full h-full" />
      <SafeAreaView className="flex flex-1">
        {/* Forecast Section */}
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        ) : (
          <Forecast data={hourlyWeather} weather={dailyWeather}/>
        )}
      </SafeAreaView>
    </View>
  );
}
