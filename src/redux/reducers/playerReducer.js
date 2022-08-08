import { ON_ANSWER, USER_LOGIN } from '../actions/actiontypes';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case USER_LOGIN:
    return { ...state, ...action.payload };
  case ON_ANSWER:
    return { ...state, assertions: state.assertions + 1, score: action.payload };
  default:
    return state;
  }
};

export default player;

// {
//   name: nome-da-pessoa,
//   assertions: número-de-acertos,
//   score: pontuação,
//   gravatarEmail: email-da-pessoa,
// }
