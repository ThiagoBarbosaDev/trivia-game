import { CHANGE_CATEGORY, CHANGE_DIFFICULTY, CHANGE_TYPE } from '../actions/actiontypes';

const INITIAL_STATE = {
  type: 'any',
  category: 'any',
  difficulty: 'any',
};

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case CHANGE_CATEGORY:
    return { ...state, category: action.payload };
  case CHANGE_DIFFICULTY:
    return { ...state, difficulty: action.payload };
  case CHANGE_TYPE:
    return { ...state, type: action.payload };
  default:
    return state;
  }
};

export default settingsReducer;
