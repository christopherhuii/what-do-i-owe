import React from 'react';
import './../scss/modal.css'
export default function Modal({show, children}) {
    return (
        <div className={`modal ${show ? 'show': ''}`}>
            <div className="modal__content">
                {children}
            </div>
        </div>
    );
}
