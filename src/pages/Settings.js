import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ComboBox from '../components/ComboBox';
import { changeCategoryAction, changeDifficultyAction,
  changeTypeAction, 
  playAgainAction,
  userLogoutAction} from '../redux/actions';
import Button from '../components/Button';
import { Redirect } from 'react-router-dom';
import { capitalizeFirstLetter } from '../helpers';

const DIFFICULTY_OPTIONS = ['Any Difficulty', 'Easy', 'Medium', 'Hard'];
const TYPE_OPTIONS = ['Any Type', 'Multiple Choice', 'True / False'];

const typeStoreOptions = {
  multiple: 'Multiple Choice',
  boolean: 'True / False',
}

// const difficultyStoreOptions = {
//   easy: 'Easy',
//   med
// }
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
    const { isLoggedIn } = this.props;
    if (isLoggedIn) { 
      this.fetchCategories(); 
    }
  }

  importSettings() {
    const { category: categoryId, type, difficulty } = this.props;
    const { categories } = this.state;
    
    const nonDefaultOption = categoryId !== 'any' || type !== 'any' || difficulty !== 'any';

    if (nonDefaultOption) {
      const categoryString = categories.find((item) => item.id ? item.id === categoryId : false ).name
      this.setState({
        selectedCategory: categoryString,
        selectedType: typeStoreOptions[type],
        selectedDifficulty: capitalizeFirstLetter(difficulty),
      })
    }
  }

  fetchCategories = async () => {
    const endpoint = 'https://opentdb.com/api_category.php';
    const response = await fetch(endpoint);
    const categories = await response.json();
    this.setState(() => ({ categories: categories.trivia_categories, isLoading: false }),
    () => this.importSettings());
  }

  handleDispatch = (name, value) => {
    const { dispatchCategory, dispatchDifficulty, dispatchType } = this.props;
    const { categories } = this.state;

    const handleDispatchType = () => (
      value === 'True / False'
      ? dispatchType('boolean')
      : dispatchType('multiple')
    );

    const handleDispatchCategory = () => {
      const categoryId = categories.find((category) => category.name === value).id;
      dispatchCategory(categoryId);
    }

    switch (name) {
    case 'selectedCategory':
      value !== 'Any Category'
      ? handleDispatchCategory()
      : dispatchCategory('any')
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

  handlePlay = () => {
    const { history: { push }, dispatchPlayAgain } = this.props;
    dispatchPlayAgain();
    push('/game');
  }

  handleLogout = () => {
    const { dispatchLogout } = this.props;
    dispatchLogout();
  }

  render() {
    const { isLoading, categories, selectedCategory, selectedType,
      selectedDifficulty } = this.state;
    const { isLoggedIn } = this.props;

    const categoryOptions = ['Any Category', ...categories
      .map((category) => category.name)];

    if (!isLoggedIn) { return <Redirect to='/'/>}

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
          <Button onClick={ () => this.handleLogout() }> Logout </Button>
          <Button onClick={ () => this.handlePlay() } > Play </Button>
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
  dispatchLogout: () => dispatch(userLogoutAction())
});

const mapStateToProps = (
    { 
      player: { isLoggedIn },
      settingsReducer: { category, type, difficulty },
    }
  ) => ({
  isLoggedIn,
  category,
  type,
  difficulty,
});

Settings.propTypes = {
  dispatchCategory: PropTypes.func.isRequired,
  dispatchDifficulty: PropTypes.func.isRequired,
  dispatchType: PropTypes.func.isRequired,
  dispatchPlayAgain: PropTypes.func.isRequired,
  dispatchLogout: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
