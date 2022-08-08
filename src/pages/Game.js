import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getToken } from '../helpers';
import Button from '../components/Button';

const second = 1000;
const timeout = 30000;
class Game extends Component {
  constructor() {
    super();
    this.state = {
      questionData: [],
      answers: [],
      isAnswered: false,
      isLoading: true,
      currentQuestion: 0,
      timer: 0,
    };

    this.timer = null;
    this.timeout = null;
  }

  componentDidMount() {
    this.fetchQuestions();
    this.setTimer();
  }

  componentWillUnmount() {
    if (this.timer) { clearInterval(this.timer); }
    if (this.timeout) { clearTimeout(this.timeout); }
  }

  setSortedAnswers = () => {
    const { questionData, currentQuestion } = this.state;
    const correctAnswer = questionData[currentQuestion].correct_answer;
    const incorrectAnswers = questionData[currentQuestion].incorrect_answers;
    const allAnswers = [correctAnswer, ...incorrectAnswers];
    const breakpoint = 0.5;
    const sortedAnswers = allAnswers.sort(() => Math.random() - breakpoint);
    this.setState({ answers: sortedAnswers, isLoading: false });
  }

  fetchQuestions = async () => {
    const token = getToken();
    const endpoint = `https://opentdb.com/api.php?amount=5&token=${token}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    this.handleTokenValidation(data);
    this.setState(() => ({ questionData: data.results }),
      () => this.setSortedAnswers());
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

  onAnswerClick = () => {
    this.setState({ isAnswered: true });
  }

  handleNextQuestion = () => {
    this.setState((prevState) => ({
      isAnswered: false,
      currentQuestion: prevState.currentQuestion + 1,
    }), () => this.setSortedAnswers());
  }

  handleNextButtonClick = () => {
    const { questionData, currentQuestion } = this.state;
    const { history: { push } } = this.props;
    const nextQuestion = questionData[currentQuestion + 1];
    const nextClick = () => (
      nextQuestion ? this.handleNextQuestion() : push('/feedback')
    );
    this.setTimer();
    nextClick();
  }

  setTimer = () => {
    this.setState({ timer: 0 });
    this.timer = setInterval(() => {
      this.setState((prevState) => ({ timer: prevState.timer + 1 }));
    }, second);
    this.timeout = setTimeout(() => {
      clearInterval(this.timer); this.setState({ isAnswered: true });
    }, timeout);
  }

  renderAnswers = () => {
    const { questionData, isAnswered, currentQuestion, answers } = this.state;
    const correctAnswer = questionData[currentQuestion].correct_answer;
    console.log(questionData[currentQuestion]);
    const answerButtons = answers.map((answerButton) => {
      const isAnswerCorrect = correctAnswer === answerButton;
      const className = isAnswerCorrect ? 'correct-answer' : 'wrong-answer';
      return (
        <Button
          dataTestId={ isAnswerCorrect ? 'correct-answer' : 'wrong-answer' }
          key={ isAnswerCorrect ? 'correctkey' : answerButton }
          className={ isAnswered ? className : null }
          onClick={ () => this.onAnswerClick() }
          disabled={ isAnswered }
        >
          { answerButton }
        </Button>
      );
    });

    // const correctAnswer = (
    //   <Button
    //     dataTestId="correct-answer"
    //     key="correctkey"
    //     className={ isAnswered ? 'correct-answer' : null }
    //     onClick={ () => this.handleAnswerStyles() }
    //     disabled={ isAnswered }
    //   >
    //     { questionData[currentQuestion].correct_answer }
    //   </Button>
    // );

    // const incorrectAnswers = questionData[currentQuestion].incorrect_answers
    //   .map((answer) => (
    //     <Button
    //       data-testid="wrong-answer"
    //       key={ answer }
    //       className={ isAnswered ? 'wrong-answer' : null }
    //       onClick={ () => this.handleAnswerStyles() }
    //       disabled={ isAnswered }
    //     >
    //       { answer }
    //     </Button>
    //   ));

    // const allAnswers = [...incorrectAnswers, correctAnswer];

    // const breakpoint = 0.5;
    // const sortedAnswers = allAnswers.sort(() => Math.random() - breakpoint);

    const sectionElement = (
      <section data-testid="answer-options">{ answerButtons }</section>
    );
    return sectionElement;
  }

  render() {
    const { questionData, isAnswered, currentQuestion, timer, isLoading } = this.state;
    if (isLoading) { return <div> loading... </div>; }
    // console.log(this.state.answers);
    return (
      <div>
        <section>
          <div>{ timer }</div>
          <h2>Category</h2>
          <p data-testid="question-category">
            { questionData[currentQuestion].category }
          </p>
          <h3 data-testid="question-text">
            { questionData[currentQuestion].question }
          </h3>
          { this.renderAnswers() }
          {/* { this.state.answers } */}
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
