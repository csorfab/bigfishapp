import { createStore as reduxCreateStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, defaultState } from './reducers';
import { weatherSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();


export function createStore() {
    const store = reduxCreateStore(
        rootReducer,
        defaultState,
        composeWithDevTools(applyMiddleware(sagaMiddleware)),
    );

    sagaMiddleware.run(weatherSaga);

    return store;
}


export default createStore;
