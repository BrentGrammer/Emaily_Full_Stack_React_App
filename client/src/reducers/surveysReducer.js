import { FETCH_ALL_SURVEYS } from '../actions/types';

export default function(state = [], action) {
  switch(action.type) {
    case FETCH_ALL_SURVEYS:
      return action.payload;
    default: 
      return state;
  }
}

