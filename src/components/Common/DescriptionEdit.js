import React, { PureComponent } from 'react';
import Octicon, { Pencil } from '@primer/octicons-react';

class DescriptionEdit extends PureComponent {
  state = {
    showIcon: false
  };

  render() {
    return (
      <div
        style={{ cursor: 'pointer' }}
        onMouseOver={e => this.setState({ showIcon: true })}
        onMouseLeave={e => this.setState({ showIcon: false })}
      >
        {this.props.children}
        <div className={(this.state.showIcon ? '' : 'invisible ') + 'float-right'}>
          <div className="text-muted" title="Edit">
            <Octicon icon={Pencil} size="small" />
          </div>
        </div>
      </div>
    );
  }
}

export default DescriptionEdit;
