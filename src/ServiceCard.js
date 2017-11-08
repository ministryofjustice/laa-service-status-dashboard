import React, { Component } from 'react';

class ModalCard extends Component {

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  get defaultState() {
    return {
      name: '',
      status: 'green',
      display: true
    };
  }

  saveAndClose() {
    if ( this.state.name !== '') {
      this.props.onSave(this.state)
        .then(() => {
          this.setState(this.defaultState);
          this.props.onClose();
        });
    }
  }

  render() {
    const style = this.props.show ? { display : 'block' } : { display : 'none' };
    const saveBtnClass = this.state.name ? 'w3-btn w3-green' : 'w3-btn w3-green w3-disabled';
    return (
      <div className="w3-modal" style={ style }>
        <div className="w3-modal-content">
          <div className="w3-container">
            <h3>Add Service</h3>
            <div className="w3-section">
              <h4>Name</h4>
              <input
                className="w3-input"
                value={ this.state.name }
                onChange={ (e) => this.setState({ name: e.target.value }) }
              />
              <h4>Status</h4>
              <p>
                <input id="green-radio" className="w3-radio" type="radio" name="status" value="green" checked={ this.state.status === 'green' } onClick={ () => this.setState({ status: 'green' }) } readOnly />
                <label className="w3-validate" htmlFor="green-radio">Green</label>
              </p>
              <p>
                <input id="amber-radio" className="w3-radio" type="radio" name="status" value="amber" checked={ this.state.status === 'amber' } onClick={ () => this.setState({ status: 'amber' }) } readOnly />
                <label className="w3-validate" htmlFor="amber-radio">Amber</label>
              </p>
              <p>
                <input id="red-radio" className="w3-radio" type="radio" name="status" value="red" checked={ this.state.status === 'red' } onClick={ () => this.setState({ status: 'red' }) } readOnly />
                <label className="w3-validate" htmlFor="red-radio">Red</label>
              </p>
              <p>
                <input id="blue-radio" className="w3-radio" type="radio" name="status" value="blue" checked={ this.state.status === 'blue' } onClick={ () => this.setState({ status: 'blue' }) } readOnly />
                <label className="w3-validate" htmlFor="blue-radio">Blue</label>
              </p>
              <h4>Show on the dashboard?</h4>
              <p>
                <input id="display-radio" className="w3-radio" type="radio" name="display" value="yes" checked={ this.state.display } onClick={ () => this.setState({ display: true }) } readOnly />
                <label className="w3-validate" htmlFor="display-radio">Yes</label>
              </p>
              <p>
                <input id="no-display-radio" className="w3-radio" type="radio" name="display" value="no" checked={ !this.state.display } onClick={ () => this.setState({ display: false }) } readOnly />
                <label className="w3-validate" htmlFor="no-display-radio">No</label>
              </p>
            </div>
            <div className="w3-section">
              <button className={ saveBtnClass } onClick={ () => this.saveAndClose() }>
                Save
              </button>
              <button className="w3-btn w3-red" onClick={ this.props.onClose }>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ServiceCard = ({ id, name, status, display, onSetStatus, onToggleStatus, onDelete }) => {
  const colors = ['green', 'amber', 'red', 'blue'];
  if (colors.indexOf(status) === -1) {
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

  const statusButtons = colors.map((color) => {
    if (color !== status) {
      return (
        <li key={ color }>
          <a className={ `w3-btn w3-${color}` } onClick={ () => onSetStatus(id, color) }>{ color }</a>
        </li>
      );
    }
    return (
      <li key={ color }>
        <a className={ `w3-btn w3-${color} w3-disabled` } onClick={ () => null }>{ color }</a>
      </li>
      );
  });

  const pauseOrStart = (display) => {
    if (display) {
      return (
        <li><a onClick={ () => onToggleStatus(id) }><i className="fa fa-pause"></i></a></li>
      );
    }
    return (
      <li><a onClick={ () => onToggleStatus(id) }><i className="fa fa-play"></i></a></li>
    );
  }

  const deleteButton = (
    <li><a onClick={
      () => {
        if (confirm(`Are you sure you want to delete service ${name}?`)) {
          onDelete(id)
        };
      }
    }><i className="fa fa-trash"></i></a></li>
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

export { ServiceCard, ModalCard };
