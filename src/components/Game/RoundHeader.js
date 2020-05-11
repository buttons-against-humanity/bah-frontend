import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';

const crToBr = function(str) {
  return str.replace(/\\n/g, '<br />');
};

class RoundHeader extends PureComponent {
  static propTypes = {
    isRoundPlayer: PropTypes.bool.isRequired,
    answered: PropTypes.bool.isRequired,
    round_end_at: PropTypes.number,
    round: PropTypes.object,
    answer: PropTypes.any,
    onConfirmAnswer: PropTypes.func.isRequired,
    onAnswerTimeout: PropTypes.func.isRequired
  };

  render() {
    const { isRoundPlayer, answered, answer, round_end_at, onConfirmAnswer, onAnswerTimeout, round } = this.props;
    const got_answer = answer && round.question.numAnswers === answer.length;
    return (
      <div className="container text-center mb-4">
        {!isRoundPlayer && !answered && <h5>Wait for the other players' answers</h5>}
        {isRoundPlayer && !answered && (
          <Countdown
            renderer={renderProps => {
              const { minutes, seconds } = renderProps.formatted;
              const className = Number(minutes) === 0 && Number(seconds) < 5 ? 'text-danger' : '';
              return <h3 className={className}>{minutes !== '00' ? `${minutes}:${seconds}` : seconds}</h3>;
            }}
            date={round_end_at}
            onComplete={onAnswerTimeout}
          />
        )}
        <div className="alert alert-dark">
          <p className="display-4" dangerouslySetInnerHTML={{ __html: this._getFullTextAnswer() }} />
          {got_answer && !answered && (
            <button className="btn btn-dark" onClick={onConfirmAnswer}>
              CONFIRM
            </button>
          )}
          {isRoundPlayer && !got_answer && <p className="mt-3">Pick {round.question.numAnswers}</p>}
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
    let text = crToBr(question.text);

    if (text.indexOf('_') < 0) {
      for (let i = 0; i < answer.length; i++) {
        text += `&nbsp<strong>${crToBr(answer[i].text)}</strong>`;
      }
    } else {
      for (let i = 0; i < answer.length; i++) {
        text = text.replace('_', ` <strong>${answer[i].text}</strong> `);
      }
    }
    return text;
  }
}

export default RoundHeader;
