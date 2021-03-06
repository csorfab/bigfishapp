import {
    LOCATION_CHANGED,
    REQUEST_WEATHER,
    RECEIVED_WEATHER,
    FAILED_REQUEST_WEATHER,
    weatherTypes,
} from './actions';

export const defaultState = {
    location: null,
    [weatherTypes.currentWeather]: {
        fetching: false,
        hasData: false,
        data: null,
    },
    [weatherTypes.forecastWeather]: {
        fetching: false,
        hasData: false,
        data: [],
    },
};

function weatherReducer(state = {}, action) {
    switch (action.type) {
        case RECEIVED_WEATHER:
            return {
                ...state,
                fetching: false,
                hasData: true,
                data: action.payload,
            };
        case REQUEST_WEATHER:
            return { ...state, fetching: true };
        case FAILED_REQUEST_WEATHER:
            return { ...state, fetching: false };
        default:
            return state;
    }
}

export function rootReducer(state = defaultState, action) {
    switch (action.type) {
        case LOCATION_CHANGED:
            return { ...state, location: action.payload };
        case REQUEST_WEATHER:
        case RECEIVED_WEATHER:
        case FAILED_REQUEST_WEATHER:
            return { ...state, [action.weatherType]: weatherReducer(state[action.weatherType], action) };
        default:
            return state;
    }
}

export default rootReducer;
