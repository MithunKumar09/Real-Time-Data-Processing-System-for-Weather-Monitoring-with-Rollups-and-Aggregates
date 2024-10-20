// services/weatherService.js

import axios from 'axios';
import Constants from 'expo-constants';

const { openWeatherMapApiKey } = Constants.expoConfig.extra;
const cityIds = {
  'Delhi': 1273294,
  'Mumbai': 1275339,
  'Chennai': 1264527,
  'Bangalore': 1277333,
  'Kolkata': 1275004,
  'Hyderabad': 1269843
};

if (!openWeatherMapApiKey) {
  throw new Error('OpenWeather API key is missing. Please check your environment configuration.');
}

// Fetching current weather data for multiple cities
export const fetchWeatherData = async () => {
  try {
    const cityIdString = Object.values(cityIds).join(',');
    const url = `https://api.openweathermap.org/data/2.5/group?id=${cityIdString}&appid=${openWeatherMapApiKey}`;
    
    const response = await axios.get(url);
    
    // Ensure that the response contains the expected data
    if (response && response.data && response.data.list) {
      return response.data.list.map(city => ({
        id: city.id,
        main: city.weather[0].main,
        temp: city.main.temp,
        feels_like: city.main.feels_like,
        humidity: city.main.humidity,
        wind_speed: city.wind.speed,
        name: city.name,
        weather: city.weather
      }));
    } else {
      throw new Error('Invalid weather data returned from API.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error; // Re-throw to handle retry logic
  }
};

// Fetching forecast data for multiple cities
export const fetchWeatherForecast = async () => {
  try {
    const cityIdString = Object.values(cityIds).join(',');
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityIdString}&appid=${openWeatherMapApiKey}`;
    
    const response = await axios.get(url);

    if (response && response.data && response.data.list) {
      return response.data.list.map(forecast => ({
        date: forecast.dt_txt,
        temp: forecast.main.temp,
        humidity: forecast.main.humidity,
        wind_speed: forecast.wind.speed,
        main: forecast.weather[0].main,
      }));
    } else {
      throw new Error('Invalid forecast data returned from API.');
    }
  } catch (error) {
    console.error('Error fetching weather forecast:', error.message);
    throw error; // Ensure the error is caught in the parent function
  }
};
