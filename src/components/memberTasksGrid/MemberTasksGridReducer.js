import {
  USER_TASKS,
  LOADING,
  ERROR,
  ERROR_MESSAGE,
  NOTIFICATION,
  ON_NOTIFICATION,
} from '../../redux/actions/actionTypes';

export default function reducer(
  state,
  { type, loading, onNotification, notification, error, errorMessage, userTasks },
) {
  switch (type) {
    case USER_TASKS: {
      return {
        ...state,
        userTasks,
      };
    }
    case LOADING: {
      return {
        ...state,
        loading,
      };
    }
    case ON_NOTIFICATION: {
      return {
        ...state,
        onNotification,
      };
    }
    case NOTIFICATION: {
      return {
        ...state,
        notification,
      };
    }
    case ERROR: {
      return {
        ...state,
        error,
      };
    }
    case ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage,
      };
    }
    default:
      return state;
  }
}
