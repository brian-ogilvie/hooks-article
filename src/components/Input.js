import React from 'react';

export default function Input({
  name,
  value,
  onChange,
  label,
  placeholder,
  type,
}) {
  return (
    <div>
      <label htmlFor={name}>
        {label}
        <input
          type={type || 'text'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
}
