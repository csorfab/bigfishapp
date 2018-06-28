import axios from 'axios';
import { weatherTypes } from './redux/actions';

const API_KEY = '123456789'; // TODO
const API_BASE_URL = 'http://api.openweathermap.org/data/2.5';

const weatherTypeApiUrlMap = {
    [weatherTypes.currentWeather]: 'weather',
    [weatherTypes.forecastWeather]: 'forecast',
};

function fetchWeather(weatherType, location) {
    return axios.get(`${API_BASE_URL}/${weatherTypeApiUrlMap[weatherType]}?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}`);
}

export default { fetchWeather };
