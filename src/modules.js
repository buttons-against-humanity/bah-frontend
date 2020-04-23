import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { cockpitReducer } from './modules/cockpit';
import { configReducer } from './modules/config';

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    cockpit: cockpitReducer,
    config: configReducer
  });

export default rootReducer;
