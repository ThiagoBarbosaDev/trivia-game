import { ON_ANSWER, USER_LOGIN } from './actiontypes';

export const userLoginAction = (payload) => ({
  type: USER_LOGIN,
  payload,
});

export const onAnswerAction = (payload) => ({
  type: ON_ANSWER,
  payload,
});
