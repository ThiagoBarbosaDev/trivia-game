import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getToken } from '../helpers';
import Button from '../components/Button';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      isAnswered: false,
      currentQuestion: 0,
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
    this.setState({ isAnswered: true });
  }

  handleNextQuestion = () => this
    .setState((prevState) => ({
      isAnswered: false,
      currentQuestion: prevState.currentQuestion + 1,
    }))

  handleNextButtonClick = () => {
    const { questions, currentQuestion } = this.state;
    const nextQuestion = questions[currentQuestion + 1];
    // nextQuestion ? this.handleNextQuestion() : null;
    if (nextQuestion) { this.handleNextQuestion(); }
  }

  renderAnswers = () => {
    const { questions, isAnswered, currentQuestion } = this.state;
    if (questions[currentQuestion]) {
      const correctAnswer = (
        <Button
          dataTestId="correct-answer"
          key="correctkey"
          className={ isAnswered ? 'correct-answer' : null }
          onClick={ () => this.handleAnswerStyles() }
        >
          { questions[currentQuestion].correct_answer }
        </Button>
      );

      const incorrectAnswers = questions[currentQuestion].incorrect_answers
        .map((answer) => (
          <Button
            data-testid="wrong-answer"
            key={ answer }
            className={ isAnswered ? 'wrong-answer' : null }
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
    const { questions, isAnswered, currentQuestion } = this.state;
    return (
      <div>
        <section>
          <h2>Category</h2>
          <p data-testid="question-category">
            { questions[currentQuestion]?.category }
          </p>
          <h3 data-testid="question-text">
            { questions[currentQuestion]?.question }
          </h3>
          { this.renderAnswers() }
          { isAnswered && (
            <Button
              dataTestId="btn-next"
              onClick={ () => this.handleNextButtonClick() }
            >
              Next
            </Button>) }
        </section>
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default Game;
