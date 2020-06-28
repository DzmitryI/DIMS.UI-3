import { combineReducers } from 'redux';
import authReducer from './auth';
import membersReducer from './members';
import statusThePageReducer from './statusThePage';

export default combineReducers({
  authData: authReducer,
  members: membersReducer,
  statusThePage: statusThePageReducer,
});
