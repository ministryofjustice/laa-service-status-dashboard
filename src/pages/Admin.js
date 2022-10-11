import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import {
  child,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set
} from 'firebase/database';

import 'font-awesome/css/font-awesome.css';
import firebaseApp from '../firebase';
import Login from './Login';
import Message from '../components/Message';
import ModalCard from '../components/ModalCard';
import ServiceCard from '../components/ServiceCard';

const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

const Admin = () => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState({});
  const [message, setMessage] = useState('');
  const [nextMessage, setNextMessage] = useState('');
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [showModalCard, setShowModalCard] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const servicesRef = ref(database, '/services');

    onValue(servicesRef, snapshot => {
      const services = {};
      snapshot.forEach((child) => {
        services[child.key] = child.val()
      });
      setServices(services);
    });

    const messageRef = ref(database, '/message');

    return onValue(messageRef, snapshot => {
      setMessage(snapshot.val() || '' );
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditMessage = () => {
    setShowModalMessage(true);
    setNextMessage(message);
  }

  const handleSaveMessage = message => {
    const messageRef = ref(database, '/message');

    return set(messageRef, message);
  }

  const handleSetStatus = (serviceId, status) => {
    const serviceStatusRef =
      ref(database, `/services/${serviceId}/status`);

    return set(serviceStatusRef, status);
  }

  const handleToggleStatus = serviceId => {
    const serviceDisplayRef =
      ref(database, `/services/${serviceId}/display`);

    return set(serviceDisplayRef, !services[serviceId].display);
  }

  const handleCreateService = ({ name, status, display }) => {
    const newId = push(child(ref(database), '/services')).key;
    const newServiceRef = ref(database, `/services/${newId}`);

    return set(newServiceRef, { name, status, display });
  }

  const handleDeleteService = serviceId => {
    const serviceRef = ref(database, `/services/${serviceId}`);

    return remove(serviceRef);
  }

  if (user === null) {
    return (
      <Login onSuccess={ () => setUser(auth.currentUser) } />
    )
  }

  return (
    <div>
      <div className={ "w3-container w3-" + process.env.REACT_APP_ADMIN_COLOUR }>
        <h2>{ process.env.REACT_APP_ADMIN_MESSAGE }</h2>
      </div>
      <div className="container">
        <div className="w3-right-align">
          { user.email }
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
          <pre id="notes_text">
            <Message
              message={ message }
              nextMessage={ nextMessage }
              onSave={ handleSaveMessage }
              showModal={ showModalMessage }
              onClose={ () => setShowModalMessage(false) }
              onChange={ val => setNextMessage(val) }
            />
          </pre>
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
            Object.keys(services)
              .map(key => [key, services[key]])
              .sort((pairA, pairB) => {
                if (pairA[1].name.trim().toLowerCase() >
                  pairB[1].name.trim().toLowerCase()) {
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
                    onSetStatus={
                      (id, newStatus) => handleSetStatus(id, newStatus)
                    }
                    onToggleStatus={ id => handleToggleStatus(id) }
                    onDelete={ id => handleDeleteService(id) }
                  />);
              })
          }
        </div>
        <ModalCard
          show={ showModalCard }
          onClose={ () => setShowModalCard(false) }
          onChange={ () => null }
          onSave={ service => handleCreateService(service) }
        />
      </div>
    </div>
  );
}

export default Admin;
