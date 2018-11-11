import { FETCH_USER } from '../actions/types';


//default state is null which is used to indicate that user logged in is undetermined
export default function(state = null, action) {
  switch(action.type) {
    case FETCH_USER:
      // payload will be the user model returned from the call to endpoint to see if user is logged in
      // if user not logged in an empty string will be returned by the req.user obj set by passport on the back end.
      return action.payload || false;
    default: return state;
  }
}