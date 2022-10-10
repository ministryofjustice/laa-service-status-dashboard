import React, { useState } from 'react';

const ModalTextArea = ({
  show, prevMessage, nextMessage, errorMessage,
  onChange, onSave, onClose
}) => {
  const style = show ? { display : 'block' } : { display : 'none' };
  const changed = prevMessage !== nextMessage;
  const saveBtnClass =
    changed ? 'w3-btn w3-green' : 'w3-btn w3-green w3-disabled';

  return (
    <div className="w3-modal" style={ style }>
      <div className="w3-modal-content">
        <div className="w3-container">
          <div className="w3-section">
            <h3>Edit Message</h3>
            <textarea
              aria-label="messageInput"
              className="w3-input w3-border"
              value={ nextMessage }
              onChange={ onChange }
            />
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
            <button
              className={ saveBtnClass }
              onClick={ onSave }
            >Save</button>
            <button
              className="w3-btn w3-red"
              onClick={ onClose }
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Message = ({
  message, prevMessage, nextMessage, showModal,
  onChange, onSave, onUpdate, onClose, onError
}) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const resetAndClose = async() => {
    setErrorMessage(null);
    onClose();
  }

  const saveAndClose = async () => {
    setErrorMessage(null);

    if (nextMessage !== prevMessage) {
      try {
        await onSave(nextMessage)
        onUpdate()
        onClose();
      } catch (error) {
        setErrorMessage('Update failed, try again later.');
        onError(error);
      }
    }
  }

  return (
    <div className="w3-panel w3-pale-white w3-border w3-border-yellow">
      <div className="w3-left-align">
        <p>{ message }</p>
      </div>
      <ModalTextArea
        prevMessage={ message }
        nextMessage={ nextMessage }
        errorMessage={ errorMessage }
        show={ showModal }
        onClose={ resetAndClose }
        onSave={ saveAndClose }
        onChange={ e => onChange(e.target.value) }
      />
    </div>
  );
}

export default Message;
