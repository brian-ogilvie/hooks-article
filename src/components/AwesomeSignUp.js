import React from 'react';
import Form, { Input } from './Form';

const validators = {
  email: 'email',
  name: 'notEmpty',
  zipCode: 'zipCode',
  password: 'notEmpty',
  passwordConfirm: 'notEmpty',
};

export default function AwesomeSignUp() {
  function onSubmit(data) {
    console.log({ ...data });
  }

  return (
    <Form onSubmit={onSubmit} heading="Please Sign Up:" validators={validators}>
      <Input name="name" label="Name:" placeholder="Enter your name." />
      <Input name="email" label="Email:" placeholder="Enter your email." />
      <Input
        name="zipCode"
        label="Zip Code:"
        placeholder="Enter your zip code."
      />
      <Input
        name="password"
        label="Password:"
        type="password"
        placeholder="Enter your password."
      />
      <Input
        name="passwordConfirm"
        label="Confirm Password:"
        type="password"
        placeholder="Confirm your password."
      />
    </Form>
  );
}
