import SagaTester from 'redux-saga-tester';
import axios from 'axios';

import { weatherSaga, fetchWeather } from './sagas';
import { defaultState, rootReducer } from './reducers';
import {
    RECEIVED_WEATHER, FAILED_REQUEST_WEATHER, requestWeather, weatherTypes, locationChanged, LOCATION_CHANGED,
} from './actions';

jest.mock('axios');

describe('Redux Saga integration test', async () => {
    const sagaTester = new SagaTester({
        initialState: defaultState,
        reducers: rootReducer,
    });

    const sagaTesterWithLoc = new SagaTester({
        initialState: { ...defaultState, location: { lat: 45, lng: 45 } },
        reducers: rootReducer,
    });

    global.navigator.geolocation = { getCurrentPosition: jest.fn(cb => cb({ coords: { latitude: 41, longitude: 37 } })) };

    sagaTester.start(weatherSaga);
    expect(sagaTester.getState()).toEqual(defaultState);

    it('asks for user location and updates the location if a location is not set', async () => {
        axios.get.mockImplementation(() => Promise.resolve({ data: [{ temp: 55 }] }));

        expect(sagaTester.getState().location).toBeNull();

        await sagaTester.waitFor(LOCATION_CHANGED);

        expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        expect(sagaTester.getState().location).toEqual({ lat: 41, lng: 37 });
    });

    sagaTesterWithLoc.start(weatherSaga);


    it('handles REQUEST_WEATHER actions correctly when the AJAX request SUCCEEDS', async () => {
        // sagaTester.dispatch(locationChanged({ lat: 45, lng: 45 }));
        axios.get.mockImplementation(() => Promise.resolve({ data: [{ temp: 55 }] }));

        sagaTesterWithLoc.dispatch(requestWeather(weatherTypes.forecastWeather));

        expect(sagaTesterWithLoc.getState()[weatherTypes.forecastWeather]).toEqual({
            ...defaultState[weatherTypes.forecastWeather], fetching: true, hasData: false,
        });

        await sagaTesterWithLoc.waitFor(RECEIVED_WEATHER, true);

        expect(sagaTesterWithLoc.getState()[weatherTypes.forecastWeather]).toEqual({
            ...defaultState[weatherTypes.forecastWeather], fetching: false, hasData: true, data: [{ temp: 55 }],
        });
    });

    it('handles REQUEST_WEATHER actions correctly when the AJAX request FAILS', async () => {
        sagaTesterWithLoc.dispatch(locationChanged({ lat: 45, lng: 45 }));
        axios.get.mockImplementation(async () => { throw ({ message: 'error' }) });

        sagaTesterWithLoc.dispatch(requestWeather(weatherTypes.currentWeather));

        expect(sagaTesterWithLoc.getState()[weatherTypes.currentWeather]).toEqual({
            ...defaultState[weatherTypes.currentWeather], fetching: true, hasData: false,
        });

        await sagaTesterWithLoc.waitFor(FAILED_REQUEST_WEATHER, true);

        expect(sagaTesterWithLoc.getState()[weatherTypes.currentWeather]).toEqual({
            ...defaultState[weatherTypes.currentWeather], fetching: false, hasData: false,
        });
    });

    it('updates location and fires REQUEST_WEATHER action when a LOCATION_CHANGED action is dispatched', async () => {
        sagaTesterWithLoc.reset(true);
        axios.get.mockImplementation(() => Promise.resolve({ data: [{ temp: 38 }] }));

        const newLocation = { lat: 30, lng: 31 };

        sagaTesterWithLoc.dispatch(locationChanged(newLocation));
        expect(sagaTesterWithLoc.getState().location).toEqual(newLocation);

        await sagaTesterWithLoc.waitFor(RECEIVED_WEATHER, true);
        const action = sagaTesterWithLoc.getLatestCalledAction();

        expect(sagaTesterWithLoc.getState()[action.weatherType]).toEqual({
            ...defaultState[action.weatherType], fetching: false, hasData: true, data: [{ temp: 38 }]
        });
    });
});