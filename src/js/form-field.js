import React from 'react';
import './../scss/form-field.css';

export default function FormField({className = '', children, label}) {
    return (
        <div className="form-field__wrapper">
            <label className={`form-field__label ${className}`}>{label}</label>
            {children}
        </div>
    );
}
