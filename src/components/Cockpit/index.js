import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { doGetCockpitExpansions } from '../../modules/cockpit';

class Cockpit extends PureComponent {
  static propTypes = {
    cockpit: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const { cockpit } = this.props;
    if (!cockpit) {
      return <div>Loading</div>;
    }
    return (
      <div className="mt-5 container">
        <div className="alert alert-dark p-5">
          <h2>Cockpit</h2>
          <h4>Expansions</h4>
          <div className="row">
            {cockpit &&
              cockpit.loaded &&
              Object.keys(cockpit.expansions).map((name, i) => {
                const expansion = cockpit.expansions[name];
                return (
                  <div key={i} className="col-lg-3 col-6 mb-3">
                    <div className="btn btn-dark p-4 w-100">
                      <h5 dangerouslySetInnerHTML={{ __html: name }} />
                      <dl className="row mt-3 mb-0">
                        <dt className="col-8">Questions: </dt>
                        <dd className="col-4">{expansion.q}</dd>
                        <dt className="col-8">Answers: </dt>
                        <dd className="col-4">{expansion.a}</dd>
                      </dl>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!this.props.cockpit.loaded) {
      this.props.dispatch(doGetCockpitExpansions());
    }
  }
}

function mapStateToProps(state) {
  const { cockpit } = state;

  return {
    cockpit
  };
}

export default connect(mapStateToProps)(Cockpit);
