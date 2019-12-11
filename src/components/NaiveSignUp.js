import React from 'react';
import useInput from '../hooks/useInput';
import Input from './Input';

export default function NaiveSignUp() {
  const [name, handleNameChange] = useInput('');
  const [email, handleEmailChange] = useInput('');
  const [password, handlePasswordChange] = useInput('');
  const [passwordConfirm, handlePasswordConfirmChange] = useInput('');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = {
      name,
      email,
      password,
      passwordConfirm,
    };
    console.log({ ...formData });
  }

  function resetForm() {
    handleNameChange('');
    handleEmailChange('');
    handlePasswordChange('');
    handlePasswordConfirmChange('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Please Sign Up:</h2>
      <Input
        name="name"
        label="Name:"
        value={name}
        onChange={handleNameChange}
        placeholder="Enter your name."
      />
      <Input
        name="email"
        label="Email:"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email."
      />
      <Input
        name="password"
        label="Password:"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter your password."
      />
      <Input
        name="passwordConfirm"
        label="Confirm Password:"
        value={passwordConfirm}
        onChange={handlePasswordConfirmChange}
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
