import { createStore as reduxCreateStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { defaultState } from './reducers';


export function createStore() {
    return reduxCreateStore(
        rootReducer,
        defaultState,
        composeWithDevTools(applyMiddleware(createSagaMiddleware)),
    );
}

export default createStore;
