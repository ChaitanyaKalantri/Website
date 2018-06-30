import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {registerUserGoogle} from "../../actions/authActions";
import {registerUserGoogleCheck} from "../../actions/authActions";

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';



class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginError: false,
      redirect: false
    };

  }


  componentDidMount(){
    if(this.props.auth.isAuthenticated){
      this.props.history.push('/dashboard');
    }
  }

  render() {

    if (this.state.redirect || sessionStorage.getItem('userData')) {
      return (<Redirect to={'/home'}/>)
    }

    const responseFacebook = (response) => {
      //console.log("facebook console");
      //console.log(response);
      //console.log(response.name);
      //console.log(response.accessToken);
      //this.signup(response, 'facebook');

      const newUser = {
        name: response.name,
        email: response.email,
        avatar: response.picture,
        password: response.id,
        password2: response.id
      };

      const id_token = {success: true, token: 'Bearer ' + response.accessToken};

      const loginUser = {
        email: response.email,
        password: response.id,
        token: id_token
      };

      this.props.registerUserGoogleCheck(newUser, loginUser, id_token, this.props.history);

      //this.props.history.push('/dashboard');
    };

    const responseGoogle = (response) => {
      //console.log("google console");
      //console.log(response.profileObj);
      //console.log(response.profileObj.name);
      //console.log(response.profileObj.email);
      //this.signup(response, 'google');

      const newUser = {
        name: response.profileObj.name,
        email: response.profileObj.email,
        avatar: response.profileObj.imageUrl,
        password: response.googleId,
        password2: response.googleId
      };

      //console.log(response.getAuthResponse().id_token);
      console.log(newUser.name);
      const id_token = {success: true, token: 'Bearer ' + response.getAuthResponse().id_token}

      const loginUser = {
        email: response.profileObj.email,
        password: response.googleId,
        token: id_token
      };

      console.log(id_token);

      this.props.registerUserGoogleCheck(newUser, loginUser, id_token, this.props.history);

    };

    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Developer Connector
                </h1>
                <p className="lead"> Create a developer profile/portfolio, share posts and get help from other
                  developers</p>
                <hr/>
                <Link to="/register" className="btn btn-secondary btn-lg mr-2">Sign Up</Link>
                <Link to="/login" className="btn btn-lg btn-info mr-2">Login</Link>


                <FacebookLogin
                  appId="623824637982268"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={responseFacebook}/>
                <br/><br/>

                <GoogleLogin
                  clientId="339351201215-nbof3cd7uomul6fbqkhnehpf82pke2dh.apps.googleusercontent.com"
                  buttonText="Login with Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
  registerUserGoogle: PropTypes.func.isRequired,
  registerUserGoogleCheck: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {registerUserGoogle, registerUserGoogleCheck})(Landing);


