import React, { Component } from 'react';

class Loading extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4 col-xs-6 col-xs-offset-3">
          <div className="progress" style={{ marginTop: '50px' }}>
            <div
              className="progress-bar progress-bar-striped active"
              role="progressbar"
              aria-valuenow="100"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
