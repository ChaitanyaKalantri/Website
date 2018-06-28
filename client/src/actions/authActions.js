import {FETCH_USER, GET_ERRORS, SET_CURRENT_USER} from "./types";
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }));
};


// Faceboook Login
export const registerUserGoogle = (userData, loginUser,history) => dispatch => {
  axios.post('/api/users/register', userData)
    .then(

      axios.post('./api/users/login', loginUser)
        .then(res => {
          // Save to localStorage
          const { token} = res.data;
          localStorage.setItem('jwtToken', token);

          // Set token to Auth header
          setAuthToken(token);

          // Decode token to get user data
          const decoded = jwt_decode(token);

          // Set current user
          dispatch(setCurrentUser(decoded));
          history.push('/dashboard');

        })
        .catch(res => {
          // Save to localStorage
          const { token} = res.data;
          localStorage.setItem('jwtToken', token);

          // Set token to Auth header
          setAuthToken(token);

          // Decode token to get user data
          const decoded = jwt_decode(token);

          // Set current user
          dispatch(setCurrentUser(decoded));
          history.push('/dashboard');

        })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }));
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios.post('./api/users/login', userData)
    .then(res => {
      // Save to localStorage
      const { token} = res.data;
      localStorage.setItem('jwtToken', token);

      // Set token to Auth header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      // Set current user
      dispatch(setCurrentUser(decoded));

    })
    .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }));
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return{
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// current_user
export const fetchUser = () =>
  (dispatch) => {
    axios.get('/api/current_user')
      .then(res => dispatch({
        type:FETCH_USER,
        payload:res.data
      }));
  };

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};