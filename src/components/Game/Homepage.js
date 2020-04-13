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
            Cards Against Humanity is a party game for horrible people. <br />
            Unlike most of the party games you've played before, Cards Against Humanity is as despicable and awkward as
            you and your friends.
            <br />
            <br />
            The game is simple. Each round, one player asks a question from a black card, and everyone else answers with
            their funniest white card.
          </p>
          <p className="mt-5">
            This is a online fork of{' '}
            <a href="https://www.cardsagainsthumanity.com/" target="_blank" rel="noopener noreferrer">
              The Original Cards Against Humanity Game
            </a>
          </p>
          <p className="mt-5">
            Source code is available on{' '}
            <a href="https://git.fluidware.it/pcah/" target="_blank" rel="noopener noreferrer">
              Fluidware's Gitlab
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
