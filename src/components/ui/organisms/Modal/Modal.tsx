import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

interface IModal {
  children: any,
  handleClose?: () => void,
}

const Modal: React.FC<IModal> = ({ children, handleClose }) => {
  const portalElement = document.getElementById('portal');

  const ele = (
    <div className='Modal__Container'>
      <div
        className='Modal__Background'
        role="button"
        tabIndex={0}
        aria-label="modal-bg"
        onClick={handleClose}
        onKeyDown={handleClose}
      />
      <div className='Modal'>
        {children}
      </div>
    </div>
  );

  return portalElement
    ? ReactDOM.createPortal(ele, portalElement) : null;
};

export default Modal;