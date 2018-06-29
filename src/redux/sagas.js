import { call, put, take, takeLatest, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { requestWeather, receivedWeather, failedRequestWeather, REQUEST_WEATHER, LOCATION_CHANGED, weatherTypes, locationChanged } from './actions';
import Api from '../api';

const AUTO_UPDATE_INTERVAL = 60000;

export function* fetchWeather(action) {
    try {
        const location = yield select(state => state.location);
        const weather = yield call(Api.fetchWeather, action.weatherType, location);
        yield put(receivedWeather(action.weatherType, weather.data));
    } catch (e) {
        yield put(failedRequestWeather(action.weatherType));
    }
}

function* updateAllWeathers() {
    yield put(requestWeather(weatherTypes.forecastWeather));
    yield put(requestWeather(weatherTypes.currentWeather));
}

function* getUserLocation() {
    yield delay(500);

    try {
        const userLocation = yield call(Api.getUserLocation);
        const currentLocation = yield select(state => state.location);

        if (!currentLocation) {
            yield put(locationChanged(userLocation));
        }
    } catch (e) {
        console.log(e);
    }
}

function* autoUpdateLoop() {
    yield take(LOCATION_CHANGED);

    while (true) {
        yield delay(AUTO_UPDATE_INTERVAL);
        yield call(updateAllWeathers);
    }
}

export function* weatherSaga(action) {
    yield all([
        takeLatest(takenAction => takenAction.type === REQUEST_WEATHER && takenAction.weatherType === weatherTypes.forecastWeather, fetchWeather),
        takeLatest(takenAction => takenAction.type === REQUEST_WEATHER && takenAction.weatherType === weatherTypes.currentWeather, fetchWeather),
        takeLatest(LOCATION_CHANGED, updateAllWeathers),
        call(autoUpdateLoop),
        call(getUserLocation),
    ]);
}