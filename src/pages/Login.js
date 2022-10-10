import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

const Login = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    if (email !== '' && password !== '') {
      try {
        setLoading(true);
        const user = await Auth.signIn(email, password);
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          alert('Password change is required. Please contact the Administrator');
        }
        onSuccess(user)
      } catch (error) {
        setLoading(false);
        setLoginFailed(true);
        setErrorMessage(error.message||'An error occurred. Try again later');
      }
    }
    else if (email === '') {
      setLoading(false);
      setLoginFailed(true);
      setErrorMessage('Email required');
    }
    else if (password === '') {
      setLoading(false);
      setLoginFailed(true);
      setErrorMessage('Password required');
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={ handleLogin } name="form">
        <h1>Login</h1>
        {
          loginFailed ?
            (<div className="error">
              <p className="message">{ errorMessage }</p>
            </div>) : null
        }
        <label htmlFor="emailInput"><b>Email</b></label>
        <input
          id="emailInput"
          className="email"
          type="text"
          placeholder="Enter Email"
          name="email"
          value={ email }
          onChange={ (e) => setEmail(e.target.value) }
        />
        <label htmlFor="passwordInput"><b>Password</b></label>
        <input
          id="passwordInput"
          className="password"
          type="password"
          placeholder="Enter Password"
          name="password"
          value={ password }
          onChange={ (e) => setPassword(e.target.value) }
        />
        <button
          className="w3-btn-block w3-padding-large w3-green"
          type="submit"
        >{ loading ? 'Please wait...' : 'Login' }</button>
      </form>
    </div>
  );
}

export default Login;
