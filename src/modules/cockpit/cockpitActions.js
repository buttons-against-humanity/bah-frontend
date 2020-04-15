import Cockpit from './index';

export const SET_COCKPIT_EXPANSIONS = 'SET_COCKPIT_EXPANSIONS';

export function doGetCockpitExpansions() {
  return dispatch => {
    return Cockpit.getExpansions()
      .then(data => {
        dispatch(setCockpitExpansions(data));
      })
      .catch(error => {});
  };
}

function setCockpitExpansions(data) {
  return {
    type: SET_COCKPIT_EXPANSIONS,
    data
  };
}
