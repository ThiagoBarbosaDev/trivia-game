import { USER_LOGIN } from './actiontypes';

const userLoginAction = (payload) => ({
  type: USER_LOGIN,
  payload,
});

export default userLoginAction;
