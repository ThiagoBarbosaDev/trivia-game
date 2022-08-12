import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import Button from '../components/Button';
import Input from '../components/Input';
import { saveTokenToLocalStorage } from '../helpers';
import { userLoginAction } from '../redux/actions';
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
    const { dispatchLogin } = this.props;
    const { email: gravatarEmail, name } = this.state;
    const { history: { push } } = this.props;
    const endpoint = 'https://opentdb.com/api_token.php?command=request';
    const response = await fetch(endpoint);
    const { token } = await response.json();
    saveTokenToLocalStorage('token', token);
    dispatchLogin({ name, gravatarEmail });
    push('/settings');
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
        </header>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatchLogin: (payload) => dispatch(userLoginAction(payload)),
});

Login.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
}.isRequired;

export default connect(null, mapDispatchToProps)(Login);
