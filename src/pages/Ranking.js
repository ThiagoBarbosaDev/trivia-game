import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/Button';
import { updateRanking } from '../helpers/index';

class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ranking: [],
    };
  }

  componentDidMount() {
    this.handleStorage();
  }

  handleHomeClick = () => {
    const { history: { push } } = this.props;
    push('/');
  }

handleStorage = () => {
  const { name, score, gravatarEmail } = this.props;
  const gravatarHash = md5(gravatarEmail).toString();
  const payload = { name: name, score, picture: `https://www.gravatar.com/avatar/${gravatarHash}` };
  const rankingData = updateRanking(payload);
  this.setState({
    ranking: rankingData,
  });
};

renderRanking = () => {
  const { ranking } = this.state;
  const sortedRanking = ranking.sort((a, b) => b.score - a.score);
  const rankingElements = sortedRanking.map((item, index) => (
    <li
      key={ `${item.name}${index}` }
    >
      <img src={ item.picture } alt="gravatar logo" />
      <div
        data-testid={ `player-name-${index}` }
      >
        {item.name}
      </div>
      <div
        data-testid={ `player-score-${index}` }
      >
        {item.score}
      </div>
    </li>
  ));
  return <ul>{rankingElements}</ul>;
}

render() {
  if (!isLoggedIn) { return <Redirect to='/'/>}

  return (
    <div>
      <main>
        <h2 data-testid="ranking-title">
          Ranking
        </h2>
        <Button
          dataTestId="btn-go-home"
          onClick={ () => this.handleHomeClick() }
        >
          Logout
        </Button>
        {this.renderRanking()}
      </main>
    </div>
  );
}
}

const mapStateToProps = ({ player: { name, score, gravatarEmail, isLoggedIn } }) => ({
  name,
  score,
  gravatarEmail,
  isLoggedIn,
});

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  gravatarEmail: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Ranking);
