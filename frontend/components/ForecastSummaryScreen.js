import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ForecastSummaryScreen = ({ forecastData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Forecast</Text>
      {forecastData.length > 0 ? (
        forecastData.map((item, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text>{`Date: ${item.date}`}</Text>
            <Text>{`Condition: ${item.main}`}</Text> {/* Correct field */}
            <Text>{`Temperature: ${item.temp}°C`}</Text>
            <Text>{`Humidity: ${item.humidity}%`}</Text>
            <Text>{`Wind Speed: ${item.wind_speed} m/s`}</Text>
          </View>
        ))
      ) : (
        <Text>No forecast data available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastItem: {
    marginBottom: 10,
  },
});

export default ForecastSummaryScreen;
