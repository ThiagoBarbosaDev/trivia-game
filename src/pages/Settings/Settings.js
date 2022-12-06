import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ComboBox from '../../components/ComboBox';
import { changeCategoryAction, changeDifficultyAction,
  changeTypeAction,
  playAgainAction,
  userLogoutAction } from '../../redux/actions';
import Button from '../../components/Button';
import { capitalizeFirstLetter } from '../../helpers';
import styles from './Settings.module.scss';

const DIFFICULTY_OPTIONS = ['Any Difficulty', 'Easy', 'Medium', 'Hard'];
const TYPE_OPTIONS = ['Any Type', 'Multiple Choice', 'True / False'];

const typeStoreOptions = {
  multiple: 'Multiple Choice',
  boolean: 'True / False',
};

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

    const handleDispatchType = () => {
      switch (value) {
      case ('True / False'):
        return dispatchType('boolean');
      case ('Multiple Choice'):
        return dispatchType('multiple');
      case ('Any Type'):
        return dispatchType('any');
      default:
        break;
      }
    };

    const handleDispatchDifficulty = () => (
      value !== 'Any Difficulty'
        ? dispatchDifficulty(value.toLowerCase())
        : dispatchDifficulty('any')
    );

    const handleDispatchCategory = () => {
      if (value !== 'Any Category') {
        const categoryId = categories.find((category) => category.name === value).id;
        dispatchCategory(categoryId);
      } else {
        dispatchCategory('any');
      }
    };

    switch (name) {
    case 'selectedCategory':
      return handleDispatchCategory();
    case 'selectedDifficulty':
      return handleDispatchDifficulty();
    case 'selectedType':
      return handleDispatchType();
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

  importSettings() {
    const { category: categoryId, type, difficulty } = this.props;
    const { categories } = this.state;
    const nonDefaultOption = categoryId !== 'any'
    || type !== 'any' || difficulty !== 'any';

    if (nonDefaultOption) {
      const categoryString = categories
        .find((item) => (item.id ? item.id === categoryId : false)).name;
      this.setState({
        selectedCategory: categoryString,
        selectedType: typeStoreOptions[type],
        selectedDifficulty: capitalizeFirstLetter(difficulty),
      });
    }
  }

  render() {
    const { isLoading, categories, selectedCategory, selectedType,
      selectedDifficulty } = this.state;
    const { isLoggedIn } = this.props;

    const categoryOptions = ['Any Category', ...categories
      .map((category) => category.name)];

    if (!isLoggedIn) { return <Redirect to="/" />; }

    if (isLoading) { return <div>Loading...</div>; }

    return (
      <main className={ styles.background }>
        <header data-testid="settings-title" className={ styles.container }>
          <h2 className={ styles.heading }>Settings</h2>
          <section className={ styles['combobox-container'] }>
            <ComboBox
              className={ `form-select ${styles.select}` }
              data={ categoryOptions }
              value={ selectedCategory }
              name="selectedCategory"
              onChange={ (event) => this.handleInput(event) }
            />
            <ComboBox
              className={ `form-select ${styles.select}` }
              data={ DIFFICULTY_OPTIONS }
              value={ selectedDifficulty }
              name="selectedDifficulty"
              onChange={ (event) => this.handleInput(event) }
            />
            <ComboBox
              className={ `form-select ${styles.select}` }
              data={ TYPE_OPTIONS }
              value={ selectedType }
              name="selectedType"
              onChange={ (event) => this.handleInput(event) }
            />
          </section>
          <div className={ `btn-group ${styles['button-container']}` }>
            <Button
              className={ `btn btn-danger ${styles.button} ${styles['logout-button']}` }
              onClick={ () => this.handleLogout() }
            >
              Logout
            </Button>
            <Button
              className={ `btn btn-success ${styles.button} ${styles['play-button']}` }
              onClick={ () => this.handlePlay() }
            >
              Play
            </Button>
          </div>
        </header>
      </main>
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
