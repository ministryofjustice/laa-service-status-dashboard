import React, { useEffect, useState } from 'react';

import '../assets/css/w3.css';
import StatusRows from '../components/StatusRow';
import { getMessage, getServices } from '../dynamodb';
import { filterServices } from '../utils'

const App = () => {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const services = await getServices()
      setServices(services);

      const message = await getMessage()
      setMessage(message);
    } catch (error) {
      console.warn(error);
    }
  }

  return (
    <table id="status_table">
      <thead>
        <tr>
          <th id="header" colSpan={ 2 }>Service Status</th>
        </tr>
      </thead>
      <tbody>
        {
          filterServices(services, true)
            .map((service, key) => {
              return (
                <StatusRows
                  key={ key }
                  name={ service.name }
                  status={ service.status }
                />
              )
            })
        }
        <tr>
          <td id="notes_cell" colSpan={ 2 }>
            <div className="message-box message-box--pub">
              { message }
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default App;
