import React from 'react';

const ServiceCard = ({
  id, name, status, display, onSetStatus, onToggleStatus, onDelete
}) => {
  const colours = ['green', 'amber', 'red', 'blue'];
  if (colours.indexOf(status) === -1) {
    status = 'red';
  }

  let className;
  if (display) {
    className = `w3-card-2 service-card w3-${status}`;
  } else {
    if (status === 'amber') {
      className = `w3-card-2 service-card w3-pale-yellow`;
    } else {
      className = `w3-card-2 service-card w3-pale-${status}`;
    };
  }

  const statusButtons = colours.map((colour) => {
    if (colour !== status) {
      return (
        <li key={ colour }>
          <a
            role="button"
            aria-label={ `setStatus-${colour}-${id}` }
            className={ `w3-btn w3-${colour}` }
            onClick={ () => onSetStatus(id, colour) }
          >{ colour }</a>
        </li>
      );
    }
    return (
      <li key={ colour }>
        <a
          role="button"
          aria-label={ `setStatus-${colour}-${id}` }
          tabIndex="0"
          className={ `w3-btn w3-${colour} w3-disabled` }
          onClick={ () => null }
        >{ colour }</a>
      </li>
    );
  });

  const pauseOrStart = (display) => {
    if (display) {
      return (
        <li>
          <a
            role="button"
            aria-label={ `toggleStatus-${id}` }
            onClick={ () => onToggleStatus(id) }
          >
            <i className="fa fa-pause"></i>
          </a>
        </li>
      );
    }
    return (
      <li>
        <a
          role="button"
          aria-label={ `toggleStatus-${id}` }
          onClick={ () => onToggleStatus(id) }
        >
          <i className="fa fa-play"></i>
        </a>
      </li>
    );
  }

  const deleteButton = (
    <li>
      <a
        role="button"
        aria-label={ `deleteService-${id}` }
        onClick={
          () => {
            const msg =
              `Are you sure you want to delete service ${name}?`
            if (confirm(msg)) {
              onDelete(id)
            };
          }
        }
      ><i className="fa fa-trash"></i></a>
    </li>
  );

  return (
    <div className="w3-col m4 l3">
      <div className={ className }>
        <h2 className="w3-center">{ name }</h2>
        <footer className="w3-container w3-white">
          <ul className="w3-navbar w3-light-grey w3-border">
            { statusButtons }
            { pauseOrStart(display) }
            { deleteButton }
          </ul>
        </footer>
      </div>
    </div>
  );
}

export default ServiceCard;
