// @flow

import * as React from 'react';
import './../scss/form-field.css';

type Props = {
    className: string,
    children: React.Node,
    label: string,
    onChange: Function,
    name: string,
    step: number,
    type: text,
    placeholder: string,
    value: string
}

export default function FormInput({
  className = '', children, label, onChange, name, step = 1, type = 'text', placeholder = '', value
}: Props) {
  const inputProps = {
    className: 'form-field__input',
    onChange,
    name,
    type,
    placeholder
  };

  if (type.toLowerCase() === 'number') {
    inputProps.step = step || 1;
  }

  if (value !== undefined) {
    inputProps.value = value;
  }
  return (
    <div className={`form-field__wrapper ${className}`}>
      {label ? (
        <label className="form-field__label" htmlFor={label}>{label}</label>
      ) : null}
      <input {...inputProps} />
      {children}
    </div>
  );
}
