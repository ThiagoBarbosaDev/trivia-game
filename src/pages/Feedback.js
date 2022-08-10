import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/Button';
import Header from '../components/Header';

class Feedback extends Component {
  renderFeedback = () => {
    const { assertions } = this.props;
    const feedback = assertions > 2 ? 'Well Done!' : 'Could be better...';
    return feedback;
  };

  handlePlayAgainClick = () => {
    const { history: { push } } = this.props;
    push('/');
  }

  handleRankingClick = () => {
    const { history: { push } } = this.props;
    push('/ranking');
  };

  render() {
    const { assertions, score } = this.props;
    return (
      <div>
        <Header />
        <h2 data-testid="feedback-text">
          { this.renderFeedback() }
        </h2>
        <p>
          {'Você acertou '}
          <span data-testid="feedback-total-question">{assertions}</span>
          {' perguntas.'}
        </p>
        <p>
          {'Um total de '}
          <span data-testid="feedback-total-score">{score}</span>
          {' pontos'}
        </p>
        <Button
          dataTestId="btn-play-again"
          onClick={ () => this.handlePlayAgainClick() }
        >
          Play Again
        </Button>
        <Button
          dataTestId="btn-ranking"
          onClick={ () => this.handleRankingClick() }
        >
          Ranking
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ player: { assertions, score } }) => ({
  assertions,
  score,
});

Feedback.propTypes = {
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default connect(mapStateToProps, null)(Feedback);
