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

  handleRankingClick = () => {
    const { history: { push } } = this.props;
    push('/ranking');
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
          dataTestId="btn-ranking"
          onClick={ () => this.handleRankingClick() }
        >
          Ranking
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ player: { assertions } }) => ({
  acertos: assertions,
});

Feedback.propTypes = {
  acertos: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, null)(Feedback);
