import { combineReducers } from 'redux';
import authReducer from './auth';
import membersReducer from './members';

export default combineReducers({
  authData: authReducer,
  members: membersReducer,
});
