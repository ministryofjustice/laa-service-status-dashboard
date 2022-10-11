import React, { useState } from 'react';

const ModalCard = ( { show, onSave, onUpdate, onClose, onError }) => {
  const defaultState = {
    name: '',
    status: 'green',
    display: true
  };

  const [state, setState] = useState(defaultState);
  const [errorMessage, setErrorMessage] = useState(null);

  const resetAndClose = async() => {
    setErrorMessage(null);
    onClose();
  }

  const saveAndClose = async () => {
    setErrorMessage(null);

    if (state.name !== '') {
      try {
        await onSave(state)
        onUpdate()
        setState(defaultState);
        onClose();
      } catch (error) {
        setErrorMessage('Update failed, try again later.');
        onError(error);
      }
    }
  }

  const style = show ? { display : 'block' } : { display : 'none' };
  const saveBtnClass =
    state.name ? 'w3-btn w3-green' : 'w3-btn w3-green w3-disabled';

  return (
    <div className="w3-modal" style={ style }>
      <div className="w3-modal-content">
        <div className="w3-container">
          <h3>Add Service</h3>
          <div className="w3-section">
            <h4>Name</h4>
            <input
              className="w3-input"
              value={ state.name }
              onChange={
                (e) => setState({...state, name: e.target.value })
              }
            />
            <h4>Status</h4>
            <p>
              <input
                id="green-radio"
                className="w3-radio"
                type="radio"
                name="status" value="green"
                checked={ state.status === 'green' }
                onClick={ () => setState({...state, status: 'green' }) }
                readOnly />
              <label className="w3-validate" htmlFor="green-radio">
                Green
              </label>
            </p>
            <p>
              <input
                id="amber-radio"
                className="w3-radio"
                type="radio"
                name="status"
                value="amber"
                checked={ state.status === 'amber' }
                onClick={ () => setState({...state, status: 'amber' }) }
                readOnly />
              <label className="w3-validate" htmlFor="amber-radio">
                Amber
              </label>
            </p>
            <p>
              <input
                id="red-radio"
                className="w3-radio"
                type="radio"
                name="status"
                value="red"
                checked={ state.status === 'red' }
                onClick={ () => setState({...state, status: 'red' }) }
                readOnly />
              <label className="w3-validate" htmlFor="red-radio">
                Red
              </label>
            </p>
            <p>
              <input
                id="blue-radio"
                className="w3-radio"
                type="radio"
                name="status"
                value="blue"
                checked={ state.status === 'blue' }
                onClick={ () => setState({...state, status: 'blue' }) }
                readOnly />
              <label className="w3-validate" htmlFor="blue-radio">
                Blue
              </label>
            </p>
            <h4>Show on the dashboard?</h4>
            <p>
              <input
                id="display-radio"
                className="w3-radio"
                type="radio"
                name="display"
                value="yes"
                checked={ state.display }
                onClick={ () => setState({...state, display: true }) }
                readOnly />
              <label className="w3-validate" htmlFor="display-radio">
                Yes
              </label>
            </p>
            <p>
              <input
                id="no-display-radio"
                className="w3-radio"
                type="radio"
                name="display"
                value="no"
                checked={ !state.display }
                onClick={ () => setState({...state, display: false }) }
                readOnly />
              <label className="w3-validate" htmlFor="no-display-radio">
                No
              </label>
            </p>
          </div>
          <div className="w3-section">
            {
              errorMessage ?
                (<div className="error">
                  <p className="message">{ errorMessage }</p>
                </div>) : null
            }
          </div>
          <div className="w3-section">
            <button className={ saveBtnClass } onClick={ saveAndClose }>
              Save
            </button>
            <button className="w3-btn w3-red" onClick={ resetAndClose }>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCard;
