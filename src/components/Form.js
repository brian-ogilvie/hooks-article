import React, { cloneElement } from 'react';
import useForm from '../hooks/useForm';
import useFormValidation from '../hooks/useFormValidation';

export function Input({ name, formData, onChange, label, placeholder, type }) {
  return (
    <div>
      <label htmlFor={name}>
        {label}
        <input
          type={type || 'text'}
          name={name}
          value={formData[name] || ''}
          onChange={onChange}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
}

export default function Form({ onSubmit, heading, children, validators }) {
  const { formData, handleSubmit, resetForm, updateField } = useForm(onSubmit);
  const { formIsValid } = useFormValidation(formData, validators);

  function renderChildren() {
    return children.map(child =>
      cloneElement(child, {
        formData,
        onChange: updateField,
        key: children.indexOf(child),
      })
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{heading}</h2>
      {renderChildren()}
      <div className="form-buttons">
        <button type="submit" disabled={!formIsValid}>
          Submit
        </button>
        <button type="button" onClick={resetForm}>
          Reset Form
        </button>
      </div>
    </form>
  );
}
