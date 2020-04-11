import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store';
import './assets/css/pcah.scss';

import App from './App';

const initialState = {};
const store = configureStore(initialState);

ReactDOM.render(<App store={store} />, document.getElementById('root'));
