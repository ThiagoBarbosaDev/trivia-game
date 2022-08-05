import React, { Component } from 'react';
import '../App.css';
import PropTypes from 'prop-types';
import Input from '../components/Input';
import logo from '../trivia.png';
import Button from '../components/Button';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
    };
  }

  handleInput = ({ target: { value, name } }) => this.setState({ [name]: value });

  render() {
    const { name, email } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <Input
            dataTestId="input-player-name"
            type="text"
            name="name"
            value={ name }
            onChange={ this.handleInput }
          />
          <Input
            dataTestId="input-gravatar-email"
            type="email"
            value={ email }
            name="email"
            onChange={ this.handleInput }
          />
          <Button
            dataTestId="btn-play"
            disabled={ !(name && email) }
          >
            Play
          </Button>
        </header>
      </div>
    );
  }
}

Login.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
}.isRequired;

export default Login;
