import { getData } from '../lib/utils/httputils';

export const SET_CONFIG = 'SET_CONFIG';

const initialState = {
  loaded: false
};

export function configReducer(state = initialState, action) {
  if (action.type === SET_CONFIG) {
    return Object.assign({}, state, { ...action.config, loaded: true });
  } else {
    return state;
  }
}

export function setConfig(config) {
  return {
    type: SET_CONFIG,
    config
  };
}

class Config {
  static apiPath = '/api/config';

  static async get() {
    return getData(`${Config.apiPath}`);
  }
}

export default Config;
