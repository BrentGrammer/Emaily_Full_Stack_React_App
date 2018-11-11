import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  // axios returns the response body in the data property of the res object.
  dispatch({ type: FETCH_USER, payload: res.data })  
};
