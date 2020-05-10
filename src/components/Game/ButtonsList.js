import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ButtonsList extends PureComponent {
  static propTypes = {
    player: PropTypes.object.isRequired,
    onAnswer: PropTypes.func.isRequired
  };

  render() {
    const { player, onAnswer } = this.props;
    return (
      <div className="container">
        <h4 className="text-center">COMPLETE THE SENTENCE...</h4>
        <div className="row">
          {player.answers.map((answer, i) => {
            return (
              <div key={i} className="col-lg-3 col-6 mb-3">
                <button
                  className="btn btn-dark p-4 w-100 h-100"
                  onClick={() => onAnswer(answer)}
                  dangerouslySetInnerHTML={{ __html: answer.text }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ButtonsList;
