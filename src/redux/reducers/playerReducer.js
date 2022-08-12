import { ON_ANSWER, PLAY_AGAIN, USER_LOGIN } from '../actions/actiontypes';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
  isLoggedIn: false,
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case USER_LOGIN:
    return { ...INITIAL_STATE, ...action.payload, isLoggedIn: true };
  case ON_ANSWER:
    return { ...state, assertions: state.assertions + 1, score: action.payload };
  case PLAY_AGAIN:
    return { ...state, assertions: 0, score: 0 };
  default:
    return state;
  }
};

export default player;
