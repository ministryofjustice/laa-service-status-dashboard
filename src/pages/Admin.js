import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

import 'font-awesome/css/font-awesome.css';
import Login from './Login';
import Message from '../components/Message';
import ModalCard from '../components/ModalCard';
import ServiceCard from '../components/ServiceCard';
import useToggle from '../hooks/useToggle';
import { filterServices } from '../utils'
import {
  getMessage,
  getServices,
  putService,
  deleteService,
  updateMessage,
  updateServiceStatus,
  toggleServiceDisplay
} from '../dynamodb';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [nextMessage, setNextMessage] = useState('');
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [showModalCard, setShowModalCard] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [refresh, setRefresh] = useToggle();

  useEffect(() => { fetchUser() }, [])
  useEffect(() => { fetchData() }, [refresh]);

  const fetchUser = async () => {
    try {
      setAuthenticating(true);
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
    } catch (e) {
      setUser(null);
      handleError(e);
    } finally {
      setAuthenticating(false);
    }
  }

  const fetchData = async () => {
    try {
      setFetching(true);
      const services = await getServices()
      setServices(services);
      const message = await getMessage()
      setMessage(message);
    } catch (e) {
      handleError(e);
    } finally {
      setFetching(false);
    }
  }

  const handleError = error => {
    switch (error.code) {
      case 'AccessDeniedException':
        console.error('Unauthorised request, access denied');
        setUser(null);
        break;
      case 'UnauthenticatedUserException':
        console.warn('Unauthenticated request, login required');
        setUser(null);
        break;
      default:
        console.error(error)
        break;
    }
  }

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (e) {
      handleError(e);
    }
  };

  const handleEditMessage = () => {
    setShowModalMessage(true);
    setNextMessage(message);
  }

  const handleSaveMessage = async message => {
    return await updateMessage(message, user.username)
  }

  const handleSetStatus = async (name, status) => {
    return await updateServiceStatus(name, status, user.username)
  }

  const handleToggleDisplay = async (name, display) => {
    return await toggleServiceDisplay(name, display, user.username)
  }

  const handleCreateService = async ({ name, status, display }) => {
    return await putService(name, status, display, user.username)
  }

  const handleDeleteService = async name => {
    return await deleteService(name)
  }

  if (authenticating) {
    return (<div>Loading...</div>)
  }

  if (!authenticating && user === null) {
    return (<Login onSuccess={ (user) => setUser(user) } />)
  }

  return (
    <div>
      <div className="w3-overlay" style={{ display: fetching ? 'block' : 'none' }}>
        <div className="w3-container w3-padding-xxlarge w3-display-topmiddle">
          <ul className="w3-navbar">
            <li><span className="fa fa-spinner w3-spin" style={{ fontSize: '25px' }}></span></li>
            <li><span className="w3-padding-tiny">Updating...</span></li>
          </ul>
        </div>
      </div>
      <div className={ "w3-container w3-" + process.env.REACT_APP_ADMIN_COLOUR }>
        <h2>{ process.env.REACT_APP_ADMIN_MESSAGE }</h2>
      </div>
      <div className="container">
        <div className="w3-right-align">
          { user.username }
          <span className="sign-out" onClick={ handleSignOut }>
            Sign out
          </span>
        </div>
        <ul className="w3-navbar w3-light-grey w3-xlarge">
          <li className="w3-navitem">Message</li>
          <li className="w3-right">
            <a
              role="button"
              aria-label="editMessage"
              tabIndex="0"
              onClick={ handleEditMessage }
            >
              <i className="fa fa-pencil"></i>
            </a>
          </li>
        </ul>
        <div className="w3-container">
          <div className="message-box">
            <Message
              message={ message }
              nextMessage={ nextMessage }
              onSave={ handleSaveMessage }
              onUpdate={ () => setRefresh(true) }
              showModal={ showModalMessage }
              onClose={ () => setShowModalMessage(false) }
              onChange={ val => setNextMessage(val) }
              onError= { e => handleError(e) }
            />
          </div>
        </div>
        <ul className="w3-navbar w3-light-grey w3-xlarge">
          <li className="w3-navitem">Services</li>
          <li className="w3-right">
            <a
              role="button"
              aria-label="addService"
              onClick={ () => setShowModalCard(true) }
            >
              <i className="fa fa-plus"></i>
            </a>
          </li>
        </ul>
        <div className="w3-row">
          {
            filterServices(services, false)
              .map((service, key) => {
                return (
                  <ServiceCard
                    key={ key }
                    id={ key }
                    name={ service.name }
                    display={ service.display }
                    status={ service.status }
                    onSetStatus={
                      (newStatus) => handleSetStatus(service.name, newStatus)
                    }
                    onToggleStatus={ () => handleToggleDisplay(service.name, !service.display) }
                    onUpdate={ () => setRefresh(true) }
                    onDelete={ () => handleDeleteService(service.name) }
                    onError={ (e) => handleError(e) }
                  />);
              })
          }
        </div>
        <ModalCard
          show={ showModalCard }
          onClose={ () => setShowModalCard(false) }
          onSave={ service => handleCreateService(service) }
          onUpdate={ () => setRefresh(true) }
          onError={ e => handleError(e) }
        />
      </div>
    </div>
  );
}

export default Admin;
