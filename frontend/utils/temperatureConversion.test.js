// utils/temperatureConversion.test.js
import { kelvinToCelsius, kelvinToFahrenheit } from './temperatureConversion';

describe('Temperature Conversion Functions', () => {
  test('kelvinToCelsius converts Kelvin to Celsius correctly', () => {
    expect(kelvinToCelsius(273.15)).toBe('0.00');
    expect(kelvinToCelsius(310.15)).toBe('37.00');
    expect(kelvinToCelsius(300)).toBe('26.85');
  });

  test('kelvinToFahrenheit converts Kelvin to Fahrenheit correctly', () => {
    expect(kelvinToFahrenheit(273.15)).toBe('32.00');
    expect(kelvinToFahrenheit(310.15)).toBe('98.60');
    expect(kelvinToFahrenheit(300)).toBe('80.33');
  });

  test('kelvinToCelsius handles invalid input', () => {
    expect(kelvinToCelsius(null)).toBe('NaN');
    expect(kelvinToCelsius(undefined)).toBe('NaN');
    expect(kelvinToCelsius(-10)).toBe('-283.15');
  });

  test('kelvinToFahrenheit handles invalid input', () => {
    expect(kelvinToFahrenheit(null)).toBe('NaN');
    expect(kelvinToFahrenheit(undefined)).toBe('NaN');
    expect(kelvinToFahrenheit(-10)).toBe('-446.00');
  });
});
