import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Feedback extends Component {
  renderFeedback = () => {
    const { acertos } = this.props;
    console.log(acertos);
    const feedback = acertos > 2 ? 'Well Done!' : 'Could be better...';
    return feedback;
  };

  render() {
    const { acertos } = this.props;
    const multiplicação = 10;
    return (
      <div>
        <h2 data-testid="feedback-text">
          { this.renderFeedback() }
        </h2>
        <p data-testid="feedback-total-question">
          {`Você acertou ${acertos}!`}
        </p>
        <p data-testid="feedback-total-score">
          {`Um total de ${acertos * multiplicação} pontos`}
        </p>
      </div>
    );
  }
}

const mapStateToProps = ({ playerReducer: { assertions } }) => ({
  acertos: assertions,
});

Feedback.propTypes = {
  acertos: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, null)(Feedback);
