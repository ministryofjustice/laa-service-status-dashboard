import React, { Component } from 'react';
import firebase from 'firebase';

import Login from './Login.js';
import { ServiceCard, ModalCard } from './ServiceCard.js';
import Message from './Message.js';

import 'font-awesome/css/font-awesome.css';

class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      services: {},
      message: '',
      nextMessage: '',
      showModalMessage: false,
      showModalCard: false
    };
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

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  handleSaveMessage(message) {
    return firebase.database().ref().update({
      '/message': message
    });
  }

  setStatus(serviceId, status) {
    return firebase.database().ref().update({
      [`/services/${serviceId}/status`]: status
    });
  }

  toggleStatus(serviceId) {
    return firebase.database().ref().update({
      [`/services/${serviceId}/display`]: ! this.state.services[serviceId].display
    });
  }

  createService({ name, status, display }) {
    const newId = firebase.database().ref('/services').push().key;
    return firebase.database().ref().update({
      [`/services/${newId}`]: { name, status, display }
    });
  }

  deleteService(serviceId) {
    return firebase.database().ref(`/services/${serviceId}`).remove();
  }

  render() {
    if (this.state.user === null) {
      return (
        <Login onSuccess={
          () => this.setState({ user: firebase.auth().currentUser })
        }/>
      );
    }
    return(
      <div>
        <div className="w3-container w3-teal">
          <h2>Admin</h2>
        </div>
        <div className="container">
          <div className="w3-right-align">
            { this.state.user.email }
            <span className="sign-out" onClick={ () => firebase.auth().signOut() }>Sign out</span>
          </div>
          <ul className="w3-navbar w3-light-grey w3-xlarge">
            <li className="w3-navitem">Message</li>
            <li className="w3-right">
              <a onClick={ () => this.setState({ showModalMessage: true, nextMessage: this.state.message })}><i className="fa fa-pencil"></i></a>
            </li>
          </ul>
          <div className="w3-container">
            <pre id="notes_text">
              <Message
                message={ this.state.message }
                nextMessage={ this.state.nextMessage }
                onSave={ this.handleSaveMessage }
                showModal={ this.state.showModalMessage }
                onClose={ () => this.setState({ showModalMessage: false }) }
                onChange={ (val) => this.setState({ nextMessage: val })}
              />
            </pre>
          </div>
          <ul className="w3-navbar w3-light-grey w3-xlarge">
            <li className="w3-navitem">Services</li>
            <li className="w3-right">
              <a onClick={ () => this.setState({ showModalCard: true }) }><i className="fa fa-plus"></i></a>
            </li>
          </ul>
          <div className="w3-row">
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
                  return (
                    <ServiceCard
                      key={ key }
                      id={ key }
                      name={ name }
                      display={ display }
                      status={ status }
                      onSetStatus={ (id, newStatus) => this.setStatus(id, newStatus) }
                      onToggleStatus={ (id) => this.toggleStatus(id) }
                      onDelete={ id => this.deleteService(id) }
                    />);
                })
            }
          </div>
          <ModalCard
            show={ this.state.showModalCard }
            onClose={ () => this.setState({ showModalCard: false }) }
            onChange={ () => null }
            onSave={ (service) => this.createService(service) }
          />
        </div>
      </div>
    );
  }
}

export default Admin;
