import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Octicon, { Heart } from '@primer/octicons-react';

class AnswersList extends PureComponent {
  static propTypes = {
    winner: PropTypes.any,
    is_card_czar: PropTypes.bool.isRequired,
    has_valid_answers: PropTypes.bool,
    answers: PropTypes.array,
    onChooseWinner: PropTypes.func.isRequired,
    card_czar_name: PropTypes.string.isRequired
  };

  render() {
    const { answers, is_card_czar, has_valid_answers, onChooseWinner, card_czar_name, winner } = this.props;
    return (
      <div className="container text-center mb-4">
        <div className="alert alert-dark">
          {winner && winner.player && <h2>{winner.player.name} wins!!</h2>}
          {winner && winner.player === '' && <h2>void round...</h2>}
          {is_card_czar && !winner && <h2>Which one do you prefer?</h2>}
          {!is_card_czar && !winner && (
            <h4>
              Wait for <strong>{card_czar_name}</strong> to choose the winner...
            </h4>
          )}
          <div className="list-group">
            {answers.map((answer, i) => {
              const spanText = (
                <span dangerouslySetInnerHTML={{ __html: answer.text ? answer.text : '** Unanswered **' }} />
              );
              const itemClass = winner && winner.player.uuid === answer.player_uuid ? 'list-group-item-success' : '';
              if (is_card_czar) {
                return (
                  <div
                    key={i}
                    className={`list-group-item p-5 d-flex justify-content-between align-items-center ${itemClass}`}
                  >
                    {spanText}
                    {answer.text && !winner && (
                      <button className="btn btn-dark" onClick={e => onChooseWinner(answer)}>
                        <Octicon icon={Heart} size="small" />
                      </button>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={i} className={`list-group-item p-5 ${itemClass}`}>
                    {spanText}
                  </div>
                );
              }
            })}
          </div>
          {is_card_czar && !has_valid_answers && !winner && (
            <div className="alert alert-danger my-3">
              No valid answers!
              <button className="btn btn-outline-danger ml-3" onClick={() => onChooseWinner(false)}>
                CONTINUE
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AnswersList;
