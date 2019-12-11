import React from 'react';
import useForm from '../hooks/useForm';
import Input from './Input';

export default function BetterSignUp() {
  function onSubmit(data) {
    console.log({ ...data });
  }
  const { formData, updateField, resetForm, handleSubmit } = useForm(onSubmit);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Please Sign Up:</h2>
      <Input
        name="name"
        label="Name:"
        value={formData.name}
        onChange={updateField}
        placeholder="Enter your name."
      />
      <Input
        name="email"
        label="Email:"
        value={formData.email}
        onChange={updateField}
        placeholder="Enter your email."
      />
      <Input
        name="password"
        label="Password:"
        type="password"
        value={formData.password}
        onChange={updateField}
        placeholder="Enter your password."
      />
      <Input
        name="passwordConfirm"
        label="Confirm Password:"
        type="password"
        value={formData.passwordConfirm}
        onChange={updateField}
        placeholder="Confirm your password."
      />
      <div className="form-buttons">
        <button type="submit">Submit</button>
        <button type="button" onClick={resetForm}>
          Reset Form
        </button>
      </div>
    </form>
  );
}
