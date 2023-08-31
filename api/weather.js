import axios from 'axios';

const BASE_URL = 'https://weatherapi-com.p.rapidapi.com';

export const fetchHourlyWeatherByCoords = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        q: `${latitude},${longitude}`,
      },
      headers: {
        'X-RapidAPI-Key': 'af257acf8dmshecc0eadddb273bbp106b73jsn3a8d1e7c600f',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch weather data');
    }
  } catch (error) {
    throw error;
  }
};
export const fetchDailyWeatherByCoords = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        q: `${latitude},${longitude}`,
        days: '3'
      },
      headers: {
        'X-RapidAPI-Key': 'af257acf8dmshecc0eadddb273bbp106b73jsn3a8d1e7c600f',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch weather data');
    }
  } catch (error) {
    throw error;
  }
};