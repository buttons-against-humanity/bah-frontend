import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';

class RoundHeader extends PureComponent {
  static propTypes = {
    is_card_czar: PropTypes.bool.isRequired,
    answered: PropTypes.bool.isRequired,
    round_end_at: PropTypes.number,
    round: PropTypes.object,
    answer: PropTypes.object,
    onConfirmAnswer: PropTypes.func.isRequired,
    onAnswerTimeout: PropTypes.func.isRequired
  };

  render() {
    const { is_card_czar, answered, answer, round_end_at, onConfirmAnswer, onAnswerTimeout } = this.props;
    return (
      <div className="container text-center mb-4">
        {is_card_czar && !answered && <h5>Wait for the other players' answers</h5>}
        {!is_card_czar && !answered && (
          <Countdown
            renderer={renderProps => {
              const { minutes, seconds } = renderProps.formatted;
              return <h3>{minutes !== '00' ? `${minutes}:${seconds}` : seconds}</h3>;
            }}
            date={round_end_at}
            onComplete={onAnswerTimeout}
          />
        )}
        <div className="alert alert-dark">
          <p className="display-4" dangerouslySetInnerHTML={{ __html: this._getFullTextAnswer() }} />
          {answer && !answered && (
            <button className="btn btn-dark" onClick={onConfirmAnswer}>
              CONFIRM
            </button>
          )}
        </div>
      </div>
    );
  }

  _getFullTextAnswer() {
    const { round, answer } = this.props;
    if (!answer) {
      return round.question.text;
    }
    const { question } = round;
    let text = question.text;
    if (text.indexOf('_') < 0) {
      text += `<strong>${answer.text}</strong>`;
    } else {
      if (question.numAnswers === 1) {
        text = text.replace('_', ` <strong>${answer.text}</strong> `);
      } else if (question.numAnswers > 1) {
        for (let i = 0; i < question.numAnswers; i++) {
          text = text.replace('_', ` <strong>${answer.text[i]}</strong> `);
        }
      }
    }
    return text;
  }
}

export default RoundHeader;
