import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import './App.css';
import {Provider} from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {logoutUser, setCurrentUser} from "./actions/authActions";
import {clearCurrentProfile} from './actions/profileActions'
import PrivateRoute from './components/common/PrivateRoute';
import CreateProfile from './components/create-profile/CreateProfile';


//Check for token
if(localStorage.jwtToken){
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now()/1000;
  if(decoded.exp < currentTime){
    // Logout the user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.disptach(clearCurrentProfile());

    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Router>
      <div className="App">
        <Navbar/>
        <Route exact path="/" component={Landing} />
        <div className="container">
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
          <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard}/>
          </Switch>
          <Switch>
            <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
          </Switch>
        </div>
        <Footer/>
      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
