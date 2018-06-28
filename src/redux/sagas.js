import { call, put, takeEvery, takeLatest, select, all } from 'redux-saga/effects';
import { requestWeather, receivedWeather, failedRequestWeather, REQUEST_WEATHER, LOCATION_CHANGED, weatherTypes } from './actions';
import Api from '../api';

export function* fetchWeather(action) {
    try {
        const location = yield select(state => state.location);
        const weather = yield call(Api.fetchWeather, action.weatherType, location);
        yield put(receivedWeather(action.weatherType, weather.data));
    } catch (e) {
        // console.log(e);
        yield put(failedRequestWeather(action.weatherType));
    }
}

function* locationChanged(action) {
    yield put(requestWeather(weatherTypes.forecastWeather));
    yield put(requestWeather(weatherTypes.currentWeather));
}

export function* weatherSaga(action) {
    yield all([
        takeEvery(REQUEST_WEATHER, fetchWeather),
        takeLatest(LOCATION_CHANGED, locationChanged),
    ]);
}