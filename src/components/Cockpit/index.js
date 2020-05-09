import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { doGetCockpitExpansions } from '../../modules/cockpit';

class Cockpit extends PureComponent {
  static propTypes = {
    cockpit: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const { cockpit } = this.props;
    if (!cockpit) {
      return <div>Loading</div>;
    }
    const details = this.getDetails(cockpit.expansions);
    return (
      <div className="mt-5 container-fluid">
        <div className="alert alert-dark py-3">
          <h2>Expansions</h2>
          <h4>
            {details.langs} languages - {details.expansions} decks - {details.questions} questions - {details.answers}{' '}
            answers
          </h4>
          <div className="row mt-4">
            {cockpit &&
              cockpit.loaded &&
              Object.keys(cockpit.expansions).map((name, i) => {
                const expansion = cockpit.expansions[name];
                return (
                  <div key={i} className="col-lg-3 col-6 mb-3">
                    <div className="btn btn-dark p-4 w-100 h-100">
                      <h5 dangerouslySetInnerHTML={{ __html: expansion.name }} />
                      <dl className="row mt-3 mb-0">
                        <dt className="col-4 text-right">Questions: </dt>
                        <dd className="col-8 text-left">{expansion.q}</dd>
                        <dt className="col-4 text-right">Answers: </dt>
                        <dd className="col-8 text-left">{expansion.a}</dd>
                        <dt className="col-4 text-right">Language: </dt>
                        <dd className="col-8 text-left">{expansion.lang}</dd>
                        {expansion.author && <dt className="col-4 text-right">Author: </dt>}
                        {expansion.author && (
                          <dd className="col-8 text-left">
                            {expansion.url ? (
                              <a target="_blank" rel="noopener noreferrer" href={expansion.url}>
                                {expansion.author}
                              </a>
                            ) : (
                              expansion.author
                            )}
                          </dd>
                        )}
                      </dl>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!this.props.cockpit.loaded) {
      this.props.dispatch(doGetCockpitExpansions());
    }
  }

  getDetails(expansions) {
    const data = {
      langs: 0,
      expansions: 0,
      questions: 0,
      answers: 0
    };
    if (!expansions) {
      return data;
    }
    const langs = [];

    Object.keys(expansions).forEach(deckcode => {
      const deck = expansions[deckcode];
      data.expansions++;
      if (!langs.includes(deck.lang)) {
        data.langs++;
        langs.push(deck.lang);
      }
      data.questions += deck.q;
      data.answers += deck.a;
    });
    return data;
  }
}

function mapStateToProps(state) {
  const { cockpit } = state;

  return {
    cockpit
  };
}

export default connect(mapStateToProps)(Cockpit);
