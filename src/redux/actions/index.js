import { CHANGE_CATEGORY, CHANGE_DIFFICULTY, CHANGE_TYPE, ON_ANSWER,
  PLAY_AGAIN,
  USER_LOGIN } from './actiontypes';

export const userLoginAction = (payload) => ({
  type: USER_LOGIN,
  payload,
});

export const onAnswerAction = (payload) => ({
  type: ON_ANSWER,
  payload,
});

export const playAgainAction = () => ({
  type: PLAY_AGAIN,
});

export const changeCategoryAction = (payload) => ({
  type: CHANGE_CATEGORY,
  payload,
});

export const changeDifficultyAction = (payload) => ({
  type: CHANGE_DIFFICULTY,
  payload,
});

export const changeTypeAction = (payload) => ({
  type: CHANGE_TYPE,
  payload,
});
