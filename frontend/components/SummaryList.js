// components/SummaryList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SummaryList = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await axios.get('http://192.168.201.187:5001/summaries'); // Ensure this URL is correct
      console.log('Summaries fetched:', response.data); // Log fetched data for debugging
      setSummaries(response.data);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      Alert.alert('Error', 'Unable to fetch summaries. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const renderSummaryItem = ({ item }) => (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryText}>Date: <Text style={styles.boldText}>{item.date}</Text></Text>
      <Text style={styles.summaryText}>Avg Temp: <Text style={styles.boldText}>{item.avgTemp}°C</Text></Text>
      <Text style={styles.summaryText}>Max Temp: <Text style={styles.boldText}>{item.maxTemp}°C</Text></Text>
      <Text style={styles.summaryText}>Min Temp: <Text style={styles.boldText}>{item.minTemp}°C</Text></Text>
      <Text style={styles.summaryText}>Avg Wind Speed: <Text style={styles.boldText}>{item.avgWindSpeed} m/s</Text></Text>
      <Text style={styles.summaryText}>Avg Humidity: <Text style={styles.boldText}>{item.avgHumidity}%</Text></Text>
      <Text style={styles.summaryText}>Dominant Condition: <Text style={styles.boldText}>{item.dominantCondition}</Text></Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={summaries}
          renderItem={renderSummaryItem}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8', // Light background for contrast
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333', // Darker text for visibility
  },
  summaryItem: {
    marginVertical: 8,
    padding: 15,
    backgroundColor: '#ffffff', // White background for each item
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light border for definition
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#555', // Medium grey text for summaries
  },
  boldText: {
    fontWeight: 'bold', // Bold text for highlighted values
    color: '#007BFF', // Blue color for emphasis
  },
  loadingIndicator: {
    marginTop: 50, // Space above the loader
  },
  listContainer: {
    paddingBottom: 20, // Space below the list
  },
});

export default SummaryList;
