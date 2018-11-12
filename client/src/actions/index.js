import axios from 'axios';
import { FETCH_USER, FETCH_ALL_SURVEYS } from './types';


export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  // axios returns the response body in the data property of the res object.
  dispatch({ type: FETCH_USER, payload: res.data })  
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);
  // history is passed from SurveyFormReview which uses withRouter helper wrapper to access it and pass it here to redirect user.
  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchAllSurveys = () => async dispatch => {
  const res = await axios.get('api/surveys');

  dispatch({ type: FETCH_ALL_SURVEYS, payload: res.data });
}
