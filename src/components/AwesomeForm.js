import React from 'react';
import Form from './Form';
import Input from './Input';

export default function AwesomeForm() {
  function onSubmit(data) {
    console.log({ ...data });
  }

  return (
    <Form onSubmit={onSubmit} heading="Please Sign Up:">
      <Input name="name" label="Name:" placeholder="Enter your name." />
      <Input name="email" label="Email:" placeholder="Enter your email." />
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
