import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Make sure this is installed

const WeatherDashboard = ({ weatherData }) => {
  // Error boundary handling
  if (!weatherData || !Array.isArray(weatherData) || weatherData.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No weather data available.</Text>
      </View>
    );
  }

  // Function to map weather conditions to icons
  const getWeatherIcon = (condition) => {
    const iconMap = {
      Clear: 'weather-sunny',
      Clouds: 'weather-cloudy',
      Rain: 'weather-rainy',
      Snow: 'weather-snowy',
      Thunderstorm: 'weather-lightning',
      Drizzle: 'weather-rainy',
      Mist: 'weather-fog',
      Haze: 'weather-hazy',
      Fog: 'weather-fog',
    };
    return iconMap[condition] || 'weather-sunny'; // Default icon
  };

  const renderWeatherCard = ({ item }) => {
    const weatherIcon = getWeatherIcon(item.weather[0].main);

    // Animation for temperature
    const tempAnim = new Animated.Value(0);
    Animated.timing(tempAnim, {
      toValue: item.temp,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    return (
      <View style={styles.card}>
        <Text style={styles.city}>{item.name}</Text>
        <MaterialCommunityIcons 
          name={weatherIcon} 
          size={48} 
          color={item.weather[0].main === 'Clear' ? '#f7b733' : '#4f8a8b'}
          style={styles.weatherIcon}
        />
        <Animated.Text style={styles.temp}>{item.temp}°C</Animated.Text>
        <Text style={styles.description}>{item.weather[0].description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={weatherData}
        renderItem={renderWeatherCard}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#e0f7fa',
    flex: 1,
    marginTop: 10,
  },
  list: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    width: 230,
    alignItems: 'center',
    transform: [{ scale: 1 }],
    transition: 'transform 0.2s ease-in-out',
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  weatherIcon: {
    marginVertical: 10,
  },
  temp: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff7043',
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#757575',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default WeatherDashboard;
//marginTop: 5,