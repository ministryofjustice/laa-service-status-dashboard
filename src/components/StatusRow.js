import React from 'react';

const StatusRow = ({ name, status }) => {
  const text = {
    green: 'Good Service',
    amber: 'Minor Issues',
    red: 'Severe Issues',
    blue: 'Scheduled Outage'
  }[status];

  return (
    <tr className="status_row">
      <td className={`status_cell ${status}`}>{ name }</td>
      <td className={`status_cell ${status}`}>{ text }</td>
    </tr>
  )
}

export default StatusRow;
