import axios from 'axios';
import { weatherTypes } from './redux/actions';

const API_KEY = 'f3ad6c2ec893dcfc9bb23f45ebfc70a3'; // TODO
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherTypeApiUrlMap = {
    [weatherTypes.currentWeather]: 'weather',
    [weatherTypes.forecastWeather]: 'forecast',
};

function fetchWeather(weatherType, location) {
    if (!location || !location.lat) throw 'Invalid location';

    return axios.get(`${API_BASE_URL}/${weatherTypeApiUrlMap[weatherType]}?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}`);
}

function getUserLocation() {
    if (!navigator.geolocation) {
        throw 'No Geolocation support';
    }

    return new Promise(
        (resolve, reject) => navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
            reject,
        ),
    );
}

export default { fetchWeather, getUserLocation };
