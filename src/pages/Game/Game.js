import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { getToken } from '../../helpers';
import { onAnswerAction, userLogoutAction } from '../../redux/actions';
import styles from './Game.module.scss';

const second = 1000;
const timeout = 30000;

const unescapeHtml = (text) => text
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#039;/g, '\'');

class Game extends Component {
  constructor() {
    super();
    this.state = {
      questionData: [],
      answers: [],
      isAnswered: false,
      isLoading: true,
      currentQuestion: 0,
      timer: 30,
    };

    this.timer = null;
    this.timeout = null;
  }

  componentDidMount() {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.fetchQuestions();
      this.setTimer();
    }
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  // timer functions
  clearTimers = () => {
    clearInterval(this.timer);
    clearTimeout(this.timeout);
  }

  setTimer = () => {
    this.setState({ timer: 30 });

    this.timer = setInterval(() => {
      this.setState((prevState) => ({ timer: prevState.timer - 1 }));
    }, second);

    this.timeout = setTimeout(() => {
      clearInterval(this.timer); this.setState({ isAnswered: true });
    }, timeout);
  }

  // fetch related functions
  handleEndpoint = (token) => {
    const { category, difficulty, type } = this.props;

    const categoryEndpoint = category === 'any' ? '' : `&category=${category}`;
    const difficultyEndpoint = difficulty === 'any' ? '' : `&difficulty=${difficulty}`;
    const typeEndpoint = type === 'any' ? '' : `&type=${type}`;

    const endpoint = `https://opentdb.com/api.php?amount=5&token=${token}${categoryEndpoint}${difficultyEndpoint}${typeEndpoint}`;
    return endpoint;
  }

  fetchQuestions = async () => {
    const token = getToken();
    const endpoint = this.handleEndpoint(token);
    const response = await fetch(endpoint);
    const data = await response.json();
    this.handleNotEnoughResults(data);
    this.handleTokenValidation(data);

    this.setState(() => ({ questionData: data.results }),
      () => this.setSortedAnswers());
  }

  handleTokenValidation = ({ response_code: response }) => {
    const tokenNotFound = 3;
    if (response === tokenNotFound) { this.handleInvalidToken(); }
  }

  handleNotEnoughResults = ({ response_code: response }) => {
    const noResults = 4;
    if (response === noResults) { this.handleInvalidToken(); }
  }

  handleInvalidToken = () => {
    const { dispatchLogout } = this.props;
    localStorage.removeItem('token');
    dispatchLogout();
  }

  // data structure handling functions
  handleMultipleQuestion = () => {
    const { questionData, currentQuestion } = this.state;

    const correctAnswer = questionData[currentQuestion].correct_answer;
    const incorrectAnswers = questionData[currentQuestion].incorrect_answers;
    const allAnswers = [correctAnswer, ...incorrectAnswers];

    const breakpoint = 0.5;
    const sortedAnswers = allAnswers.sort(() => Math.random() - breakpoint);

    this.setState({ answers: sortedAnswers, isLoading: false });
  }

  handleBooleanQuestion = () => {
    const { questionData, currentQuestion } = this.state;

    const correctAnswer = questionData[currentQuestion].correct_answer;
    const incorrectAnswer = questionData[currentQuestion].incorrect_answers[0];

    const booleanOptions = correctAnswer === 'True'
      ? [correctAnswer, incorrectAnswer]
      : [incorrectAnswer, correctAnswer];

    this.setState({ answers: booleanOptions, isLoading: false });
  }

  setSortedAnswers = () => {
    const { questionData, currentQuestion } = this.state;
    if (questionData[currentQuestion].type === 'multiple') {
      this.handleMultipleQuestion();
    } else {
      this.handleBooleanQuestion();
    }
  }

  // render related functions
  renderAnswers = () => {
    const { questionData, isAnswered, currentQuestion, answers } = this.state;

    const answerButtons = answers.map((answerButton) => {
      const correctAnswer = questionData[currentQuestion].correct_answer;
      const isAnswerCorrect = correctAnswer === answerButton;
      const className = isAnswerCorrect
        ? styles['correct-answer']
        : styles['wrong-answer'];

      return (
        <Button
          dataTestId={ isAnswerCorrect ? 'correct-answer' : 'wrong-answer' }
          key={ isAnswerCorrect ? 'correctkey' : answerButton }
          className={ `btn btn-secondary ${isAnswered ? className : ''}` }
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
      <section data-testid="answer-options" className={ styles['headings-wrapper'] }>{ answerButtons }</section>
    );
    return sectionElement;
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

  render() {
    const { questionData, isAnswered, currentQuestion, timer,
      isLoading } = this.state;
    const { isLoggedIn } = this.props;

    if (!isLoggedIn) { return <Redirect to="/" />; }

    if (isLoading) { return <div>loading...</div>; }
    const { question, category } = questionData[currentQuestion];
    const parsedQuestion = unescapeHtml(question);

    return (
      <main className={ styles.background }>
        <section className={ styles.container }>
          <Header />
          <div className={ styles.timer }>{ timer }</div>
          <div className={ styles['headings-wrapper'] }>
            <h2 className={ styles.heading }>Category</h2>
            <h3 data-testid="question-category" className={ styles['sub-heading'] }>
              { category }
            </h3>
          </div>
          <div className={ styles['headings-wrapper'] }>
            <h3 data-testid="question-text" className={ styles['sub-heading'] }>
              { parsedQuestion }
            </h3>
          </div>
          { this.renderAnswers() }
          { isAnswered && (
            <Button
              dataTestId="btn-next"
              onClick={ () => this.handleNextButtonClick() }
            >
              Next
            </Button>) }
        </section>
      </main>
    );
  }
}

const mapStateToProps = (
  {
    player: { score, isLoggedIn },
    settingsReducer: { category, type, difficulty },
  },
) => ({
  score,
  category,
  type,
  difficulty,
  isLoggedIn,
});

const mapDispatchToProps = (dispatch) => ({
  onAnswer: (payload) => dispatch(onAnswerAction(payload)),
  dispatchLogout: () => dispatch(userLogoutAction()),
});

Game.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  score: PropTypes.number.isRequired,
  onAnswer: PropTypes.func.isRequired,
  category: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  type: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  dispatchLogout: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
