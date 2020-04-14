import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';

const htmlToText = function(str) {
  if (str.indexOf('<b>') < 0) {
    return str;
  }
  if (str.indexOf('<small>') < 0) {
    return str;
  }
  return str.substring(3, str.indexOf('</b>')) + ' ';
};

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
              const className = Number(minutes) === 0 && Number(seconds) < 5 ? 'text-danger' : '';
              return <h3 className={className}>{minutes !== '00' ? `${minutes}:${seconds}` : seconds}</h3>;
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
    let text = htmlToText(question.text);

    if (text.indexOf('_') < 0) {
      const answer_text = htmlToText(answer.text);
      text += `<strong>${answer_text}</strong>`;
    } else {
      if (question.numAnswers === 1) {
        const answer_text = htmlToText(answer.text);
        text = text.replace('_', ` <strong>${answer_text}</strong> `);
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
