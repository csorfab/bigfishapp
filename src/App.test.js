import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import createStore from './redux/createStore';

it('renders without crashing', () => {
  const store = createStore();
  const div = document.createElement('div');
  ReactDOM.render(<Root store={store} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
