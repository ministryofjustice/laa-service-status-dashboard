import { initializeApp } from 'firebase/app';

const {
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOM,
  REACT_APP_DB_URL,
  REACT_APP_MESSAGE_ID,
} = process.env;

export const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOM,
  databaseURL: REACT_APP_DB_URL,
  messagingSenderId: REACT_APP_MESSAGE_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
