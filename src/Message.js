import React, { Component } from 'react';

class ModalTextArea extends Component {
  
  render() {
    const style = this.props.show ? { display : 'block' } : { display : 'none' };
    const changed = this.props.prevMessage !== this.props.nextMessage;
    const saveBtnClass = changed ? 'w3-btn w3-green' : 'w3-btn w3-green w3-disabled';
    return (
      <div className="w3-modal" style={ style }>
        <div className="w3-modal-content">
          <div className="w3-container">
            <div className="w3-section">
              <h3>Edit Message</h3>
              <textarea
                className="w3-input w3-border"
                value={ this.props.nextMessage }
                onChange={ this.props.onChange }
              />
            </div>
            <div className="w3-section">
              <button className={ saveBtnClass } onClick={ this.props.onSave }>Save</button>
              <button className="w3-btn w3-red" onClick={ this.props.onClose }>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Message extends Component {

  saveAndClose() {
    if ( this.props.nextMessage !== this.props.prevMessage ) {
      this.props.onSave(this.props.nextMessage)
        .then(() => {
          this.props.onClose();
        });
    }
  }

  render() {
    return (
      <div className="w3-panel w3-pale-white w3-border w3-border-yellow">
        <div className="w3-left-align">
          <p>{ this.props.message }</p>
        </div>
        <ModalTextArea
          prevMessage={ this.props.message }
          nextMessage={ this.props.nextMessage }
          show={ this.props.showModal }
          onClose={ () => this.props.onClose()  }
          onSave={ () => this.saveAndClose() }
          onChange={ (e) => this.props.onChange(e.target.value)}
        />
      </div>
    );
  }
}

export default Message;
