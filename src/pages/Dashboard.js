import React, { useEffect, useState } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';

import '../assets/css/w3.css';
import firebaseApp from '../firebase';
import StatusRows from '../components/StatusRow';

const database = getDatabase(firebaseApp);

const App = () => {
  const [services, setServices] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const servicesRef = ref(database, '/services');

    onValue(servicesRef, (snapshot) => {
      const services = {};
      snapshot.forEach((child) => {
        services[child.key] = child.val()
      });
      setServices(services);
    });

    const messageRef = ref(database, '/message');

    return onValue(messageRef, (snapshot) => {
      setMessage(snapshot.val() || '');
    });
  }, []);

  return (
    <table id="status_table">
      <thead>
        <tr>
          <th id="header" colSpan={ 2 }>Service Status</th>
        </tr>
      </thead>
      <tbody>
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
              if (display) {
                return (
                  <StatusRows
                    key={ key }
                    name={ name }
                    status={ status }
                  />
                );
              };
              return null;
            })
        }
        <tr>
          <td id="notes_cell" colSpan={ 2 }>
            <div id="notes_div">
              <pre id="notes_text">{ message }</pre>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default App;
