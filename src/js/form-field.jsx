// @flow

import * as React from 'react';
import './../scss/form-field.css';

type Props = {
    className: string,
    children: React.Node,
    label: string
}

export default function FormField({ className = '', children, label }: Props) {
  return (
    <div className="form-field__wrapper">
      <label className={`form-field__label ${className}`} htmlFor={label}>{label}</label>
      {children}
    </div>
  );
}
