import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, ActivityIndicator, RefreshControl, View, Text, StyleSheet, FlatList } from 'react-native';
import WeatherDashboard from '../components/WeatherDashboard';
import DailySummaryScreen from '../components/DailySummaryScreen';
import AlertNotification from '../components/AlertNotification';
import TrendGraphScreen from '../components/TrendGraphScreen';
import SummaryList from '../components/SummaryList';
import { fetchWeatherData, fetchWeatherForecast } from '../services/weatherService';
import { kelvinToCelsius } from '../utils/temperatureConversion';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendEmailNotification } from '../services/emailService';

const MainApp = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState({
    avgTemp: 0,
    maxTemp: 0,
    minTemp: 0,
    dominantCondition: '',
    avgHumidity: 0,
    avgWindSpeed: 0,
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [forecastData, setForecastData] = useState([]);
  const [interval, setIntervalDuration] = useState(5 * 60 * 1000);
  const thresholdTemp = 35;
  const maxRetries = 3;
  const [refreshing, setRefreshing] = useState(false);
  const [previousDate, setPreviousDate] = useState(new Date().toISOString().split('T')[0]);
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const checkCache = async () => {
      const cachedData = await AsyncStorage.getItem('weatherData');
      if (cachedData) {
        setWeatherData(JSON.parse(cachedData)); // Load cached data
      }
      fetchWeather(); // Then, fetch new data
    };
  
    checkCache(); // Call the cache checking function
  
    const intervalId = setInterval(() => {
      fetchWeather();
    }, interval);
  
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [interval]);
  

  const fetchWeather = async () => {
    const now = Date.now();
    
    // Check if cached data exists and is still valid
    const cachedData = await AsyncStorage.getItem('weatherData');
    const cacheTime = await AsyncStorage.getItem('lastFetchTime');
  
    if (cachedData && cacheTime && now - parseInt(cacheTime) < interval) {
      console.log('Using cached weather data.');
      setWeatherData(JSON.parse(cachedData));
      return; // Return early since we have cached data
    }
  
    setLoading(true);
    try {
      const data = await fetchWeatherDataWithRetry();
      if (data && Array.isArray(data) && data.length > 0) {
        const processedData = data.map(item => ({
          ...item,
          temp: kelvinToCelsius(item.temp),
          feels_like: kelvinToCelsius(item.feels_like),
          humidity: item.humidity,
          wind_speed: item.wind_speed,
        }));
  
        // Check if weather data has significant changes before updating state
        if (isSignificantChange(processedData, weatherData)) {
          setWeatherData(processedData);
          await AsyncStorage.setItem('weatherData', JSON.stringify(processedData)); // Cache the data
          await AsyncStorage.setItem('lastFetchTime', now.toString()); // Update the fetch time
          calculateDailySummary(processedData);
          checkAlertConditions(processedData);
        } else {
          console.log('No significant changes in weather data.');
        }
  
      } else {
        console.warn('No valid weather data returned.');
        setWeatherData([]);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      Alert.alert('Error', 'Unable to fetch weather data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherDataWithRetry = async (retryCount = 0) => {
    try {
      const data = await fetchWeatherData();
      return data;
    } catch (error) {
      if (retryCount < maxRetries) {
        console.log(`Retrying weather data fetch... Attempt ${retryCount + 1}`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1))); // Increase delay for each retry
        return fetchWeatherDataWithRetry(retryCount + 1);
      }
      throw error;
    }
  };

  const isSignificantChange = (newData, oldData) => {
    if (newData.length !== oldData.length) return true;
    return newData.some((item, index) => item.temp !== oldData[index].temp);
  };

  const calculateDailySummary = (data) => {
    if (!Array.isArray(data) || data.length === 0) return;

    const validTemperatures = data
    .map(item => Number(item.temp))
      .filter(temp => !isNaN(temp) && temp !== undefined && temp !== null);

      const validHumidity = data
      .map(item => Number(item.humidity))
      .filter(humidity => !isNaN(humidity) && humidity !== undefined && humidity !== null);

    const validWindSpeed = data
      .map(item => Number(item.wind_speed))
      .filter(wind_speed => !isNaN(wind_speed) && wind_speed !== undefined && wind_speed !== null);


    if (validTemperatures.length === 0) return;

    const avgTemp = (validTemperatures.reduce((acc, temp) => acc + temp, 0) / validTemperatures.length).toFixed(2);
    const maxTemp = Math.max(...validTemperatures);
    const minTemp = Math.min(...validTemperatures);

    const avgHumidity = (validHumidity.reduce((acc, humidity) => acc + humidity, 0) / validHumidity.length).toFixed(2);
    const avgWindSpeed = (validWindSpeed.reduce((acc, wind_speed) => acc + wind_speed, 0) / validWindSpeed.length).toFixed(2);


    const conditionCounts = data.reduce((acc, item) => {
      acc[item.main] = (acc[item.main] || 0) + 1;
      return acc;
    }, {});

    const dominantCondition = Object.keys(conditionCounts).reduce((a, b) =>
      conditionCounts[a] > conditionCounts[b] ? a : b
    );

    const dailySummary = {
      avgTemp,
      maxTemp,
      minTemp,
      dominantCondition,
      avgHumidity,
      avgWindSpeed,
      date: new Date().toISOString().split('T')[0],
    };

    setSummaryData(dailySummary);
    saveDailySummary(dailySummary);
  };

  const saveDailySummary = async (summary) => {
    try {
      console.log('Sending daily summary to backend:', summary);
      const response = await axios.post('http://192.168.201.187:5001/summaries', summary, { timeout: 10000 });
      console.log('Daily summary saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving daily summary:', error); // More detailed error logging
      if (error.response) {
        Alert.alert('Error', `Server responded with status ${error.response.status}: ${error.response.data}`);
      } else if (error.request) {
        Alert.alert('Error', 'No response from the server. Please check your connection.');
      } else {
        Alert.alert('Error', `Request error: ${error.message}`);
      }
    }
  };  

  const checkAlertConditions = async (data) => {
    if (!Array.isArray(data) || data.length === 0) return;

    const recentTemps = data.slice(-2).map(item => item.temp);
    const consecutiveHighTemp = recentTemps.every(temp => temp > thresholdTemp);

    if (consecutiveHighTemp) {
      const message = `Temperature exceeded ${thresholdTemp}°C for two consecutive updates!`;
      setAlertMessage(message);
      Alert.alert('Warning', message);

      // Send email notification
      await sendEmailNotification(message);
    } else {
      setAlertMessage(null);
    }
  };

  const temperatureData = weatherData.length > 0
    ? weatherData.map((item, index) => ({
        day: `Day ${index + 1}`,
        temp: item.temp,
      }))
    : [];

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather().then(() => setRefreshing(false));
  };

  const renderItem = () => (
    <View>
      <WeatherDashboard weatherData={weatherData} />
      {alertMessage && <AlertNotification alertMessage={alertMessage} />}
      <DailySummaryScreen summaryData={summaryData} />
      <TrendGraphScreen temperatureData={temperatureData} />
      <SummaryList />
    </View>
  );

  return (
    <FlatList
      data={[1]} // Dummy data to allow rendering
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading data, please wait...</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
});

export default MainApp;
