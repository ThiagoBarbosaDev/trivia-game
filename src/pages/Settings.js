import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ComboBox from '../components/ComboBox';
import { changeCategoryAction, changeDifficultyAction, changeTypeAction } from '../redux/actions';
import { Link } from 'react-router-dom';

const DIFFICULTY_OPTIONS = ['Any Difficulty', 'Easy', 'Medium', 'Hard']
const TYPE_OPTIONS = ['Any Type', 'Multiple Choice', 'True / False']

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      categories: [],
      selectedCategory: 'Any Category',
      selectedDifficulty: 'Any Difficulty',
      selectedType: 'Any Type',
    }
  }

  componentDidMount() {
    this.fetchCategories()
  }

  fetchCategories = async () => {
    const endpoint = 'https://opentdb.com/api_category.php'
    const response = await fetch(endpoint);
    const categories = await response.json();
    this.setState({ categories: categories.trivia_categories, isLoading: false });
  }

  handleDispatch = (name, value) => {
    const { dispatchCategory, dispatchDifficulty, dispatchType } = this.props;
    const { categories } = this.state;

    if (name === 'selectedCategory') { 
      const categoryId = categories.find((category) => category.name === value).id;
      dispatchCategory(categoryId) 
    }
    if (name === 'selectedDifficulty') { dispatchDifficulty(value.toLowerCase()) }
    if (name === 'selectedType') { value === 'True / False' ? dispatchType('boolean') : dispatchType('multiple') }
  }

  handleInput = ({ target: { value, name } }) => {
    this.handleDispatch(name, value);
    this.setState({ [name]: value });
  }

  render() {
    const { isLoading, categories, selectedCategory, selectedType, selectedDifficulty } = this.state;
    const categoryOptions = ['Any Category', ...categories.map((category) => category.name)]
    if (isLoading) {return <div>Loading...</div>}
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
          <Link to='/'> Login </Link>
        </header>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatchCategory: (payload) => dispatch(changeCategoryAction(payload)),
  dispatchDifficulty: (payload) => dispatch(changeDifficultyAction(payload)),
  dispatchType: (payload) => dispatch(changeTypeAction(payload)),
})

Settings.propTypes = {
  dispatchCategory: PropTypes.func.isRequired,
  dispatchDifficulty: PropTypes.func.isRequired,
  dispatchType: PropTypes.func.isRequired,
};


export default connect(null, mapDispatchToProps)(Settings);
