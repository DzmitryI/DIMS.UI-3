import { combineReducers } from 'redux';
import authReducer from './auth';
import membersReducer from './members';

export default combineReducers({
  auth: authReducer,
  members: membersReducer,
});
