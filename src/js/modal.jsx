// @flow

import * as React from 'react';
import './../scss/modal.css';

type Props = {
    show: boolean,
    children: React.Node,
    onClose: Function
};

export default function Modal({ show, children, onClose }: Props) {
  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal__content">
        <button className="modal__close-btn" onClick={onClose}>&#10005;</button>
        {children}
      </div>
    </div>
  );
}
