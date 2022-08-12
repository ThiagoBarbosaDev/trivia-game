import { combineReducers } from 'redux';
import player from './playerReducer';
import settingsReducer from './settings';

const rootReducer = combineReducers({ player, settingsReducer });

export default rootReducer;
