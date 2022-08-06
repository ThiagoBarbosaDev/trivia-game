import PropTypes from 'prop-types';
import React, { Component } from 'react';
import '../App.css';
import Button from '../components/Button';
import Input from '../components/Input';
import { saveTokenToLocalStorage } from '../helpers';
import logo from '../trivia.png';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
    };
  }

handleSettingsClick = () => {
  const { history: { push } } = this.props;
  push('/settings');
}

  handleLoginClick = async () => {
    const { history: { push } } = this.props;
    const endpoint = 'https://opentdb.com/api_token.php?command=request';
    const response = await fetch(endpoint);
    const { token } = await response.json();
    console.log(token);
    saveTokenToLocalStorage('token', token);
    push('/game');
  };

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
            onClick={ () => this.handleLoginClick() }
          >
            Play
          </Button>
          <Button
            dataTestId="btn-settings"
            onClick={ () => this.handleSettingsClick() }
          >
            Settings
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
