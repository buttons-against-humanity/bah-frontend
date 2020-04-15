import { getData } from '../../lib/utils/httputils';
import cockpitReducer from './cockpitReducer';

class Cockpit {
  static apiPath = '/api/cockpit';

  static async getExpansions() {
    return getData(`${Cockpit.apiPath}/expansions`);
  }
}

export { cockpitReducer };
export * from './cockpitActions';
export default Cockpit;
