import React from 'react';
import './../scss/modal.css'
export default function Modal({show, children, onClose}) {
    return (
        <div className={`modal ${show ? 'show': ''}`}>
            <div className="modal__content">
                <button className="modal__close-btn" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}
