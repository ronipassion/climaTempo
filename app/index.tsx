import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { JSX, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type WeatherCode = 0 | 1 | 2 | 3 | 45 | 51 | 61 | 63 | 65 | 80 | 95;

interface WeatherInfo {
  name: string;
  icon: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  code: WeatherCode;
}

interface GeoResponse {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
    admin1?: string;
  }>;
}

interface WeatherResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

const weatherCodes: Record<WeatherCode, WeatherInfo> = {
  0: { name: 'Céu Limpo', icon: 'weather-sunny' },
  1: { name: 'Quase Limpo', icon: 'weather-partly-cloudy' },
  2: { name: 'Parcialmente Nublado', icon: 'weather-partly-cloudy' },
  3: { name: 'Nublado', icon: 'weather-cloudy' },
  45: { name: 'Nevoeiro', icon: 'weather-fog' },
  51: { name: 'Garoa Leve', icon: 'weather-rainy' },
  61: { name: 'Chuva Leve', icon: 'weather-pouring' },
  63: { name: 'Chuva Moderada', icon: 'weather-pouring' },
  65: { name: 'Chuva Forte', icon: 'weather-pouring' },
  80: { name: 'Pancadas Leves', icon: 'weather-lightning-rainy' },
  95: { name: 'Trovoada', icon: 'weather-lightning' },
};

const LAST_CITY_KEY = 'lastCity';

export default function App(): JSX.Element {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadLastCity = async (): Promise<void> => {
      try {
        const lastCity = await AsyncStorage.getItem(LAST_CITY_KEY);
        if (lastCity) {
          await searchWeather(lastCity);
        }
      } catch (err) {
        console.log('Erro ao carregar última cidade:', err);
      }
    };
    loadLastCity();
  }, []);

  const isValidWeatherCode = (code: number): code is WeatherCode => {
    return code in weatherCodes;
  };

  const searchWeather = async (searchCity: string): Promise<void> => {
    const trimmedCity = searchCity.trim();
    if (!trimmedCity) return;
    
    setLoading(true);
    setError('');
    setWeather(null);
    Keyboard.dismiss();

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedCity)}&language=pt&count=1`;
      const geoResponse = await axios.get<GeoResponse>(geoUrl);
      
      if (!geoResponse.data.results?.length) {
        throw new Error('Cidade não encontrada');
      }

      const { latitude, longitude, name, admin1 } = geoResponse.data.results[0];
      
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
      const weatherResponse = await axios.get<WeatherResponse>(weatherUrl);
      
      const { temperature_2m, weather_code } = weatherResponse.data.current;
      
      const validWeatherCode: WeatherCode = isValidWeatherCode(weather_code) ? weather_code : 0;
      
      const weatherData: WeatherData = {
        location: admin1 ? `${name}, ${admin1}` : name,
        temperature: Math.round(temperature_2m),
        code: validWeatherCode,
      };

      setWeather(weatherData);
      
      await AsyncStorage.setItem(LAST_CITY_KEY, trimmedCity);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar dados do clima';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setCity('');
    }
  };

  const handleSubmit = (): void => {
    searchWeather(city);
  };


  const handleSearch = (): void => {
    searchWeather(city);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma cidade..."
          placeholderTextColor="#999"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSearch}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <ActivityIndicator 
          size="large" 
          color="#FFF" 
          style={styles.loading}
        />
      )}
      {error && !loading && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {weather && !loading && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityText}>{weather.location}</Text>
          <MaterialCommunityIcons
            name={weatherCodes[weather.code].icon as any}
            size={120}
            color="white"
            style={styles.weatherIcon}
          />
          <Text style={styles.temperatureText}>{weather.temperature}°C</Text>
          <Text style={styles.descriptionText}>
            {weatherCodes[weather.code].name}
          </Text>
        </View>
      )}
      {!loading && !weather && !error && (
        <Text style={styles.initialText}>Busque por uma cidade</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    maxWidth: 400,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    color: '#FFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loading: {
    marginTop: 40,
  },
  weatherContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  cityText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  weatherIcon: {
    marginVertical: 20,
  },
  temperatureText: {
    fontSize: 64,
    color: '#FFF',
    fontWeight: '300',
    marginVertical: 10,
  },
  descriptionText: {
    fontSize: 20,
    color: '#DDD',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  initialText: {
    color: '#777',
    fontSize: 18,
    marginTop: 60,
    textAlign: 'center',
  },
});