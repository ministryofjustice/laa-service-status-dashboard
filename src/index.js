import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import firebase from 'firebase';

import App from './App';
import Admin from './Admin';
import './index.css';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOM,
  databaseURL: process.env.REACT_APP_DB_URL,
  messagingSenderId: process.env.REACT_APP_MESSAGE_ID
});

ReactDOM.render((
  <Router history={ browserHistory }>
    <Route path="/" component={ App } />
    <Route path="admin" component={ Admin } />
  </Router>
), document.getElementById('root'));
