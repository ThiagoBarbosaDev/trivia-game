import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { saveTokenToLocalStorage } from '../../helpers';
import { userLoginAction } from '../../redux/actions';
import logo from '../../trivia.png';
import styles from './Login.module.scss';

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
      <main className={ styles.container }>
        <header className={ styles['header-container'] }>
          <img src={ logo } alt="logo" className={ styles.logo } />
          <div className={ styles['input-wrapper'] }>
            <Input
              className={ `form-control ${styles.input}` }
              dataTestId="input-player-name"
              type="text"
              name="name"
              value={ name }
              placeholder="Player Name"
              onChange={ this.handleInput }
            />
            <Input
              className={ `form-control ${styles.input}` }
              dataTestId="input-gravatar-email"
              type="email"
              value={ email }
              name="email"
              placeholder="Player Email"
              onChange={ this.handleInput }
            />
          </div>
          <Button
            className={ `btn btn-primary ${styles['play-button']}` }
            dataTestId="btn-play"
            disabled={ !(name && email) }
            onClick={ () => this.handleLoginClick() }
          >
            Play
          </Button>
        </header>
      </main>
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
