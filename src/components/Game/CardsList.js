import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class CardsList extends PureComponent {
  static propTypes = {
    player: PropTypes.object.isRequired,
    onAnswer: PropTypes.func.isRequired
  };

  render() {
    const { player, onAnswer } = this.props;
    return (
      <div className="container">
        <h4 className="text-center">COMPLETE THE SENTENCES...</h4>
        <div className="row">
          {player.answers.map((answer, i) => {
            return (
              <div key={i} className="col-lg-3 col-6">
                <button className="btn btn-link" onClick={() => onAnswer(answer)}>
                  <div className="card p-3 mb-3">
                    <div className="card-body">
                      <div className="card-text" dangerouslySetInnerHTML={{ __html: answer.text }} />
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CardsList;
