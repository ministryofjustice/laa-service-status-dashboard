import React, { Component } from 'react';
import firebase from 'firebase';

import './w3.css';
import './App.css';

const Row = ({ name, status }) => {
  const text = {
    green: 'Good Service',
    amber: 'Minor Issues',
    red: 'Severe Issues'
  }[status];
  return (
    <tr className="status_row">
      <td className={`status_cell ${status}`}>{ name }</td>
      <td className={`status_cell ${status}`}>{ text }</td>
    </tr>
  )
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {services: {}, message: ''};
  }

  componentWillMount() {
    const database = firebase.database();
    database.ref('/services').on('value', (snapshot) => {
      const services = {};
      snapshot.forEach((child) => {
        services[child.key] = child.val()
      });
      this.setState({ services });
    });
    database.ref('/message').on('value', (snapshot) => {
      this.setState({message: snapshot.val() || ''});
    });
  }

  render() {
    return (
      <table id="status_table">
        <thead>
          <tr>
            <th id="header" colSpan={ 2 }>Service Status</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(this.state.services)
              .map((key) => [key, this.state.services[key]])
              .sort((pairA, pairB) => {
                if (pairA[1].name.trim().toLowerCase() > pairB[1].name.trim().toLowerCase()) {
                  return 1;
                };
                return -1;
              })
              .map(([key, { name, status, display }]) => {
                if (display) {
                  return (
                    <Row key={ key } name={ name } status={ status } />
                    );
                };
                return null;
              })
          }
          <tr>
            <td id="notes_cell" colSpan={ 2 }>
              <div id="notes_div">
                { this.state.message }
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default App;
