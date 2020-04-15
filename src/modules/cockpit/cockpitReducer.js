import { SET_COCKPIT_EXPANSIONS } from './cockpitActions';

const initialState = {
  loaded: false
};

export default function cockpitReducer(state = initialState, action) {
  if (action.type === SET_COCKPIT_EXPANSIONS) {
    return Object.assign({}, state, { ...action.data, loaded: true });
  } else {
    return state;
  }
}
