import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/Button';
import Header from '../components/Header';

class Feedback extends Component {
  renderFeedback = () => {
    const { acertos } = this.props;
    console.log(acertos);
    const feedback = acertos > 2 ? 'Well Done!' : 'Could be better...';
    return feedback;
  };

  handlePlayAgainClick = () => {
    const { history: { push } } = this.props;
    push('/');
  }

  render() {
    const { acertos } = this.props;
    const multiplicação = 10;
    return (
      <div>
        <Header />
        <h2 data-testid="feedback-text">
          { this.renderFeedback() }
        </h2>
        <p data-testid="feedback-total-question">
          {`Você acertou ${acertos}!`}
        </p>
        <p data-testid="feedback-total-score">
          {`Um total de ${acertos * multiplicação} pontos`}
        </p>
        <Button
          dataTestId="btn-play-again"
          onClick={ () => this.handlePlayAgainClick() }
        >
          Play Again
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ playerReducer: { assertions } }) => ({
  acertos: assertions,
});

Feedback.propTypes = {
  acertos: PropTypes.number.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default connect(mapStateToProps, null)(Feedback);
