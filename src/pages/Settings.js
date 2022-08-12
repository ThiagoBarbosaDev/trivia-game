import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ComboBox from '../components/ComboBox';
import { changeCategoryAction, changeDifficultyAction,
  changeTypeAction, 
  playAgainAction} from '../redux/actions';
import Button from '../components/Button';

const DIFFICULTY_OPTIONS = ['Any Difficulty', 'Easy', 'Medium', 'Hard'];
const TYPE_OPTIONS = ['Any Type', 'Multiple Choice', 'True / False'];

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      categories: [],
      selectedCategory: 'Any Category',
      selectedDifficulty: 'Any Difficulty',
      selectedType: 'Any Type',
    };
  }

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    const endpoint = 'https://opentdb.com/api_category.php';
    const response = await fetch(endpoint);
    const categories = await response.json();
    this.setState({ categories: categories.trivia_categories, isLoading: false });
  }

  handleDispatch = (name, value) => {
    const { dispatchCategory, dispatchDifficulty, dispatchType } = this.props;
    const { categories } = this.state;

    const handleDispatchType = () => (
      value === 'True / False'
      ? dispatchType('boolean')
      : dispatchType('multiple')
    );

    switch (name) {
    case 'selectedCategory':
      const categoryId = categories.find((category) => category.name === value).id;
      dispatchCategory(categoryId);
      break;
    case 'selectedDifficulty':
      dispatchDifficulty(value.toLowerCase());
      break;
    case 'selectedType':
      handleDispatchType();
      break;
    default:
      break;
    }
  }

  handleInput = ({ target: { value, name } }) => {
    this.handleDispatch(name, value);
    this.setState({ [name]: value });
  }

  handlePlayAgain = () => {
    const { history: { push }, dispatchPlayAgain } = this.props;
    console.log(dispatchPlayAgain);
    dispatchPlayAgain();
    push('/game');
  }

  render() {
    const { isLoading, categories, selectedCategory, selectedType,
      selectedDifficulty } = this.state;
    const { isLoggedIn } = this.props;

    const categoryOptions = ['Any Category', ...categories
      .map((category) => category.name)];

    if (isLoading) { return <div>Loading...</div>; }

    return (
      <div>
        <header data-testid="settings-title">
          <h2>Settings</h2>
          <ComboBox
            data={ categoryOptions }
            value={ selectedCategory }
            name="selectedCategory"
            onChange={ (event) => this.handleInput(event) }
          />
          <ComboBox
            data={ DIFFICULTY_OPTIONS }
            value={ selectedDifficulty }
            name="selectedDifficulty"
            onChange={ (event) => this.handleInput(event) }
          />
          <ComboBox
            data={ TYPE_OPTIONS }
            value={ selectedType }
            name="selectedType"
            onChange={ (event) => this.handleInput(event) }
          />
          <Link to="/"> Login </Link>
          { isLoggedIn && <Button onClick={ () => this.handlePlayAgain() } > Play Again </Button> }
        </header>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatchCategory: (payload) => dispatch(changeCategoryAction(payload)),
  dispatchDifficulty: (payload) => dispatch(changeDifficultyAction(payload)),
  dispatchType: (payload) => dispatch(changeTypeAction(payload)),
  dispatchPlayAgain: () => dispatch(playAgainAction()),
});

const mapStateToProps = ({ player: { isLoggedIn } }) => ({
  isLoggedIn,
});

Settings.propTypes = {
  dispatchCategory: PropTypes.func.isRequired,
  dispatchDifficulty: PropTypes.func.isRequired,
  dispatchType: PropTypes.func.isRequired,
  dispatchPlayAgain: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
