import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { cockpitReducer } from './modules/cockpit';

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    cockpit: cockpitReducer
  });

export default rootReducer;
