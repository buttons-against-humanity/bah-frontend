import { getData } from '../../lib/utils/httputils';
import cockpitReducer from './cockpitReducer';

class Cockpit {
  static apiPath = '/api/decks';

  static async getExpansions() {
    return getData(`${Cockpit.apiPath}/expansions`);
  }
}

export { cockpitReducer };
export * from './cockpitActions';
export default Cockpit;
