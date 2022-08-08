import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/Button';
import Header from '../components/Header';
import { getToken } from '../helpers';
import { onAnswerAction } from '../redux/actions';

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
    this.clearTimers();
  }

  clearTimers = () => {
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

  onWrongAnswerClick = () => {
    this.clearTimers();
    this.setState({ isAnswered: true });
  }

  onCorrectAnswerClick = () => {
    const { score: globalScore, onAnswer } = this.props;
    const { timer, questionData, currentQuestion } = this.state;

    const difficultyTier = questionData[currentQuestion].difficulty;
    const baseScore = 10;
    const difficultyScore = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    const score = globalScore + baseScore + (timer * difficultyScore[difficultyTier]);

    onAnswer(score);
    this.clearTimers();
    this.setState({ isAnswered: true });
  }

  handleNextQuestion = () => {
    this.setState((prevState) => ({
      isAnswered: false,
      currentQuestion: prevState.currentQuestion + 1,
    }),
    () => this.setSortedAnswers());
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

    const answerButtons = answers.map((answerButton) => {
      const correctAnswer = questionData[currentQuestion].correct_answer;
      const isAnswerCorrect = correctAnswer === answerButton;
      const className = isAnswerCorrect ? 'correct-answer' : 'wrong-answer';

      return (
        <Button
          dataTestId={ isAnswerCorrect ? 'correct-answer' : 'wrong-answer' }
          key={ isAnswerCorrect ? 'correctkey' : answerButton }
          className={ isAnswered ? className : null }
          onClick={ () => (
            isAnswerCorrect
              ? this.onCorrectAnswerClick()
              : this.onWrongAnswerClick()
          ) }
          disabled={ isAnswered }
        >
          { answerButton }
        </Button>
      );
    });

    const sectionElement = (
      <section data-testid="answer-options">{ answerButtons }</section>
    );
    return sectionElement;
  }

  render() {
    const { questionData, isAnswered, currentQuestion, timer, isLoading } = this.state;
    if (isLoading) { return <div> loading... </div>; }
    return (
      <div>
        <Header />
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

const mapStateToProps = ({ player: { score } }) => ({
  score,
});

const mapDispatchToProps = (dispatch) => ({
  onAnswer: (payload) => dispatch(onAnswerAction(payload)),
});

Game.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  score: PropTypes.number.isRequired,
  onAnswer: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
