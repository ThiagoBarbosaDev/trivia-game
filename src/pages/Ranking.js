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
  const { userName, score, gravatarEmail } = this.props;
  const gravatarHash = md5(gravatarEmail).toString();
  const payload = { name: userName, score, picture: `https://www.gravatar.com/avatar/${gravatarHash}` };
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
          Home
        </Button>
        {this.renderRanking()}
      </main>
    </div>
  );
}
}

const mapStateToProps = (state) => ({
  userName: state.player.name,
  score: state.player.score,
  gravatarEmail: state.player.gravatarEmail,
});

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  userName: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  gravatarEmail: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Ranking);
