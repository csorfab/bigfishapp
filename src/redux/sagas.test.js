import SagaTester from 'redux-saga-tester';
import axios from 'axios';

import { weatherSaga, fetchWeather } from './sagas';
import { defaultState, rootReducer } from './reducers';
import {
    RECEIVED_WEATHER, FAILED_REQUEST_WEATHER, requestWeather, weatherTypes, locationChanged,
} from './actions';

jest.mock('axios');

describe('Redux Saga integration test', async () => {
    const sagaTester = new SagaTester({
        initialState: defaultState,
        reducers: rootReducer,
    });

    sagaTester.start(weatherSaga);
    expect(sagaTester.getState()).toEqual(defaultState);

    it('handles REQUEST_WEATHER actions correctly when the AJAX request SUCCEED', async () => {
        axios.get.mockImplementation(() => Promise.resolve({ data: [{ temp: 55 }] }));

        sagaTester.dispatch(requestWeather(weatherTypes.forecastWeather));

        expect(sagaTester.getState()[weatherTypes.forecastWeather]).toEqual({
            ...defaultState[weatherTypes.forecastWeather], fetching: true, hasData: false,
        });

        await sagaTester.waitFor(RECEIVED_WEATHER);

        expect(sagaTester.getState()[weatherTypes.forecastWeather]).toEqual({
            ...defaultState[weatherTypes.forecastWeather], fetching: false, hasData: true, data: [{ temp: 55 }],
        });
    });

    it('handles REQUEST_WEATHER actions correctly when the AJAX request FAILS', async () => {
        axios.get.mockImplementation(async () => { throw ({ message: 'error' }) });

        sagaTester.dispatch(requestWeather(weatherTypes.currentWeather));

        expect(sagaTester.getState()[weatherTypes.currentWeather]).toEqual({
            ...defaultState[weatherTypes.currentWeather], fetching: true, hasData: false,
        });

        await sagaTester.waitFor(FAILED_REQUEST_WEATHER);

        expect(sagaTester.getState()[weatherTypes.currentWeather]).toEqual({
            ...defaultState[weatherTypes.currentWeather], fetching: false, hasData: false,
        });
    });

    it('updates location and fires REQUEST_WEATHER action when a LOCATION_CHANGED action is dispatched', async () => {
        axios.get.mockImplementation(() => Promise.resolve({ data: [{ temp: 38 }] }));

        const newLocation = { lat: 30, lng: 31 }

        sagaTester.dispatch(locationChanged(newLocation));
        expect(sagaTester.getState().location).toEqual(newLocation);

        await sagaTester.waitFor(RECEIVED_WEATHER, true);
        const action = sagaTester.getLatestCalledAction();

        expect(sagaTester.getState()[action.weatherType]).toEqual({
            ...defaultState[action.weatherType], fetching: false, hasData: true, data: [{ temp: 38 }]
        })
    });

});