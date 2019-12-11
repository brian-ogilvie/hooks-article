import React, { cloneElement } from 'react';
import useForm from '../hooks/useForm';

export default function Form({ onSubmit, heading, children }) {
  const { formData, handleSubmit, resetForm, updateField } = useForm(onSubmit);

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
        <button type="submit">Submit</button>
        <button type="button" onClick={resetForm}>
          Reset Form
        </button>
      </div>
    </form>
  );
}
