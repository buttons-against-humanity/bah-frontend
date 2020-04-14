import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Homepage extends PureComponent {
  static propTypes = {
    onCreateGame: PropTypes.func.isRequired,
    onJoinGame: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="container text-center">
        <div className="alert alert-dark mt-4 text-left">
          <p>
            Buttons Against Humanity is a party game for horrible people. <br />
            Unlike most of the party games you've played before, Buttons Against Humanity is as despicable and awkward
            as you and your friends.
            <br />
            <br />
            The game is simple. Each round, a question is shown, and everyone - but one, called "the button czar" -
            answers with their funniest button. The Button Czar has the hard work to choose the round's winner.
          </p>
          <p className="mt-5">
            This is a online clone of{' '}
            <a href="https://www.cardsagainsthumanity.com/" target="_blank" rel="noopener noreferrer">
              Cards Against Humanity Game
            </a>
          </p>
          <p className="mt-5">
            Source code is available on{' '}
            <a href="https://github.com/buttons-against-humanity" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>{' '}
            with Apache License 2.0
          </p>
        </div>
        <div className="mt-4">
          <button className="btn btn-lg mr-2 mt-2 btn-dark" onClick={this.props.onCreateGame}>
            CREATE NEW GAME
          </button>
          <button className="btn btn-lg ml-2 mt-2 btn-dark" onClick={this.props.onJoinGame}>
            JOIN A GAME
          </button>
        </div>
      </div>
    );
  }
}

export default Homepage;
