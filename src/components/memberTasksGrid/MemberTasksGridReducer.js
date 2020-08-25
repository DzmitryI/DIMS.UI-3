import { ERROR, ERROR_MESSAGE, LOADING, NOTIFICATION, ON_NOTIFICATION, TRACKS } from '../../redux/actions/actionTypes';

export default function reducer(state, { type, loading, onNotification, notification, error, errorMessage, tracks }) {
  switch (type) {
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
    case TRACKS: {
      return {
        ...state,
        tracks,
      };
    }
    default:
      return state;
  }
}
