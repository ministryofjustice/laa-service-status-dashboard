import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import firebase from 'firebase';

import App from './App';
import Admin from './Admin';
import './index.css';

firebase.initializeApp({
  apiKey: "AIzaSyCdmt3wbPgm2Kd4kLh9uHiOdvHTTrmE_rY",
  authDomain: "laa-dashboard-int.firebaseapp.com",
  databaseURL: "https://laa-dashboard-int.firebaseio.com",
  messagingSenderId: "470137477984"
});

ReactDOM.render((
  <Router history={ browserHistory }>
    <Route path="/" component={ App } />
    <Route path="admin" component={ Admin } />
  </Router>
), document.getElementById('root'));
