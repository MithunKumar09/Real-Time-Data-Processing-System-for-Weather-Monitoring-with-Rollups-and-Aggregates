import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure you install this package

const DailySummaryScreen = ({ summaryData, loading }) => {
    // Function to map weather conditions to icons and colors
    const getWeatherIcon = (condition) => {
        const iconMap = {
            Clear: { icon: 'weather-sunny', color: '#f7b733' },
            Clouds: { icon: 'weather-cloudy', color: '#4f8a8b' },
            Rain: { icon: 'weather-rainy', color: '#1f78b4' },
            Snow: { icon: 'weather-snowy', color: '#add8e6' },
            Thunderstorm: { icon: 'weather-lightning', color: '#ffb300' },
            Drizzle: { icon: 'weather-rainy', color: '#00bcd4' },
            Mist: { icon: 'weather-fog', color: '#9e9e9e' },
            Haze: { icon: 'weather-hazy', color: '#a8a7a7' },
            Fog: { icon: 'weather-fog', color: '#9e9e9e' },
            // Add more mappings as necessary
        };
        return iconMap[condition] || { icon: 'weather-sunny', color: '#f7b733' }; // Default icon and color
    };

    const weatherInfo = summaryData ? getWeatherIcon(summaryData.dominantCondition) : null;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!summaryData || !summaryData.avgTemp) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No data available</Text>
            </View>
        );
    }

    // Animation for temperature change
    const tempAnim = new Animated.Value(0);
    Animated.timing(tempAnim, {
        toValue: summaryData.avgTemp,
        duration: 2000,
        useNativeDriver: true,
    }).start();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily Weather Summary</Text>
            <View style={[styles.summaryCard, { borderColor: weatherInfo.color }]}>
                <MaterialCommunityIcons
                    name={weatherInfo.icon}
                    size={64}
                    color={weatherInfo.color}
                    style={styles.icon}
                />
                <Text style={[styles.conditionText, { color: weatherInfo.color }]}>
                    Condition: {summaryData.dominantCondition}
                </Text>
                <Animated.Text style={styles.tempText}>
                    Average Temp: {summaryData.avgTemp}°C
                </Animated.Text>
                <Text style={styles.subText}>Max Temp: {summaryData.maxTemp}°C</Text>
                <Text style={styles.subText}>Min Temp: {summaryData.minTemp}°C</Text>
                <Text style={styles.subText}>Average Humidity: {summaryData.avgHumidity}%</Text>
                <Text style={styles.subText}>Average Wind Speed: {summaryData.avgWindSpeed} m/s</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    summaryCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        elevation: 10,
        borderWidth: 2,
        borderColor: '#f7b733',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
    },
    icon: {
        marginBottom: 15,
    },
    conditionText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    tempText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
    },
    subText: {
        fontSize: 16,
        color: '#666',
        marginVertical: 2,
    },
});

export default DailySummaryScreen;
