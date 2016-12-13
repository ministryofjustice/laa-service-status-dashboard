import React, { Component } from 'react';
import firebase from 'firebase';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loginFailed: false,
      errorMessage: ''
    };
  }

  doLogin() {
    if (this.state.email !== '' && this.state.password !== '') {
      firebase.auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((result) => {
          this.props.onSuccess();
        })
        .catch((error) => {
          this.setState({ loginFailed: true, errorMessage: error.message });
        }
      );
    }
    else if (this.state.email === '') {
      this.setState({ loginFailed: true, errorMessage: 'Email required'});
    }
    else if (this.state.password === '') {
      this.setState({ loginFailed: true, errorMessage: 'Password required'});
    }
  }

  render() {
    return (
      <div className="login-container">
        <h1>Login</h1>
        {
          this.state.loginFailed ? 
           (<div className="error">
              <p className="message">{ this.state.errorMessage }</p>
            </div>) : null
        }
        <label><b>Email</b></label>
        <input
          className="email"
          type="text"
          placeholder="Enter Email"
          name="email"
          value={ this.state.email }
          onChange={ (e) => this.setState({ email: e.target.value }) }
        />
        <label><b>Password</b></label>
        <input
          className="password"
          type="password"
          placeholder="Enter Password"
          name="password"
          value={ this.state.password }
          onChange={ (e) => this.setState({ password: e.target.value }) }
        />
        <button className="w3-btn-block w3-padding-large w3-green" type="submit" onClick={ () => this.doLogin() }>Login</button>
      </div>
    );
  }
}

export default Login;
