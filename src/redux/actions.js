export const LOCATION_CHANGED = 'LOCATION_CHANGED';
export const REQUEST_WEATHER = 'REQUEST_WEATHER';
export const RECEIVED_WEATHER = 'RECEIVED_WEATHER';
export const FAILED_REQUEST_WEATHER = 'FAILED_REQUEST_WEATHER';

export const weatherTypes = {
    currentWeather: 'currentWeather',
    forecastWeather: 'forecastWeather',
};

export const locationChanged = newLocation => ({
    type: LOCATION_CHANGED,
    payload: newLocation,
});

export const requestWeather = weatherType => ({
    type: REQUEST_WEATHER,
    weatherType,
});

export const receivedWeather = (weatherType, weather) => ({
    type: RECEIVED_WEATHER,
    weatherType,
    payload: weather,
});

export const failedRequestWeather = weatherType => ({
    type: FAILED_REQUEST_WEATHER,
    weatherType,
});
