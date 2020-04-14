import React from 'react';
import PropTypes from 'prop-types';

const Homepage = props => {
  Homepage.propTypes = {
    onCreateGame: PropTypes.func.isRequired,
    onJoinGame: PropTypes.func.isRequired,
    slackin_url: PropTypes.string
  };

  return (
    <div className="container text-center">
      <div className="alert alert-dark mt-4 text-left">
        <p>
          <strong>Buttons Against Humanity</strong> is an online party game for horrible people. <br />
          Unlike most of the party games you've played before, <strong>Buttons Against Humanity</strong> is as
          despicable and awkward as you and your friends.
          <br />
          <br />
          The game is simple. Each round, a question is shown, and everyone - but one, called "the button czar" -
          answers with their funniest button. <br />
          Button Czar has the hard work to choose the round's winner.
        </p>
        <p className="mt-5">
          This is a online clone of{' '}
          <a href="https://www.cardsagainsthumanity.com/" target="_blank" rel="noopener noreferrer">
            Cards Against Humanity
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
        <button className="btn btn-lg mr-2 mt-2 btn-dark" onClick={props.onCreateGame}>
          CREATE NEW GAME
        </button>
        <button className="btn btn-lg ml-2 mt-2 btn-dark" onClick={props.onJoinGame}>
          JOIN A GAME
        </button>
      </div>
      {props.slackin_url && (
        <div className="mt-4 p-5">
          <div className="alert alert-dark">
            <a href={props.slackin_url} target="_blank" rel="noopener noreferrer">
              <strong>
                Join the community on Slack to organize and play with your friends or other people around the world
              </strong>
            </a>
            <div className="mt-3">
              <a href={props.slackin_url} target="_blank" rel="noopener noreferrer">
                <img src={`${props.slackin_url}badge.svg`} alt="Slack" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
