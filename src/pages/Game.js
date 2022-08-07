import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getToken } from '../helpers';
import Button from '../components/Button';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      showAnswerStyles: false,
    };
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  fetchQuestions = async () => {
    const token = getToken();
    const endpoint = `https://opentdb.com/api.php?amount=5&token=${token}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    this.handleTokenValidation(data);
    this.setState({ questions: data.results });
  };

  handleInvalidToken = () => {
    const { history: { push } } = this.props;
    localStorage.removeItem('token');
    push('/');
  };

  handleTokenValidation = ({ response_code: response }) => {
    const errorCode = 3;
    if (response === errorCode) { this.handleInvalidToken(); }
  }

  handleAnswerStyles = () => {
    this.setState({ showAnswerStyles: true });
  }

  renderAnswers = () => {
    const { questions, showAnswerStyles } = this.state;
    if (questions[0]) {
      const correctAnswer = (
        <Button
          dataTestId="correct-answer"
          key="correctkey"
          className={ showAnswerStyles ? 'correct-answer' : null }
          onClick={ () => this.handleAnswerStyles() }
        >
          { questions[0].correct_answer }
        </Button>
      );

      const incorrectAnswers = questions[0].incorrect_answers.map((answer) => (
        <Button
          data-testid="wrong-answer"
          key={ answer }
          className={ showAnswerStyles ? 'wrong-answer' : null }
          onClick={ () => this.handleAnswerStyles() }
        >
          { answer }
        </Button>
      ));

      const allAnswers = [...incorrectAnswers, correctAnswer];

      const breakpoint = 0.5;
      const sortedAnswers = allAnswers.sort(() => Math.random() - breakpoint);

      const element = <section data-testid="answer-options">{ sortedAnswers }</section>;
      return element;
    }
  }

  render() {
    const { questions } = this.state;
    return (
      <div>
        <section>
          <h2>Category</h2>
          <p data-testid="question-category">
            { questions[0]?.category }
          </p>
          <h3 data-testid="question-text">
            { questions[0]?.question }
          </h3>
          { this.renderAnswers() }
        </section>
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default Game;
