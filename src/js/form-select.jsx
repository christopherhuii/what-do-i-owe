// @flow

import * as React from 'react';
import './../scss/form-field.css';

type Props = {
    className: string,
    children: React.Node,
    defaultValue: string,
    label: string,
    onChange: Function,
    name: string,
    options: Array<Object>
}

export default function FormInput({
  className = '', children, defaultValue = '', label, onChange, name = '', options = []
}: Props) {
  const inputProps = {
    className: 'form-field__select',
    defaultValue,
    onChange,
    name
  };

  return (
    <div className={`form-field__wrapper ${className}`}>
      {label ? (
        <label className="form-field__label" htmlFor={label}>{label}</label>
      ) : null}
      <select {...inputProps}>
        {options.map(option => (
          <option value={option.value}>{option.text}</option>
        ))}
      </select>
      {children}
    </div>
  );
}
