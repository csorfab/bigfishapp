import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './Root';
import registerServiceWorker from './registerServiceWorker';
import createStore from './redux/createStore';

const store = createStore();

ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker();
