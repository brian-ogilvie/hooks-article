import React from 'react';

export default function Input({
  name,
  formData,
  value,
  onChange,
  label,
  placeholder,
  type,
}) {
  function renderValue() {
    const defaultValue = formData ? formData[name] : value;
    return defaultValue || '';
  }
  return (
    <div>
      <label htmlFor={name}>
        {label}
        <input
          type={type || 'text'}
          name={name}
          value={renderValue()}
          onChange={onChange}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
}
