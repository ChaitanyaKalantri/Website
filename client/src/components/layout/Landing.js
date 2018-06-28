import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {registerUserGoogle} from "../../actions/authActions";

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import PostData from "../../services/PostData";
var facebookClient = require("../../config/keys").facebookClientId;
var googleClient = require("../../config/keys").googleClientID;


class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginError: false,
      redirect: false
    };
    this.signup = this.signup.bind(this);
  }

  signup(res, type) {
    let postData;
    if (type === 'facebook' && res.email) {
      postData = {
        name: res.name,
        provider: type,
        email: res.email,
        provider_id: res.id,
        token: res.accessToken,
        provider_pic: res.picture.data.url
      };
    }

    if (type === 'google' && res.w3.U3) {
      postData = {
        name: res.w3.ig,
        provider: type,
        email: res.w3.U3,
        provider_id: res.El,
        token: res.Zi.access_token,
        provider_pic: res.w3.Paa
      };
    }

    if (postData) {
      PostData('signup', postData).then((result) => {
        let responseJson = result;
        sessionStorage.setItem("userData", JSON.stringify(responseJson));
        this.setState({redirect: true});
      });
    } else {}
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
      }

      const loginUser = {
        email: response.email,
        password: response.id
      }

      this.props.registerUserGoogle(newUser, loginUser, this.props.history);

      //this.props.history.push('/dashboard');
    }

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
      }

      const loginUser = {
        email: response.profileObj.email,
        password: response.googleId
      }

      this.props.registerUserGoogle(newUser, loginUser, this.props.history);

    }

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
                  appId={facebookClient}
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={responseFacebook}/>
                <br/><br/>

                <GoogleLogin
                  clientId={googleClient}
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
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {registerUserGoogle})(Landing);


