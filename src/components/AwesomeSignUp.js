import React from 'react';
import Form, { Input } from './Form';
import { types } from '../hooks/useFormValidation';

const schema = {
  email: types.email,
  name: types.notEmpty,
  zipCode: types.zip,
};

export default function AwesomeSignUp({ register }) {
  return (
    <Form onSubmit={register} heading="Please Sign Up:" schema={schema}>
      <Input name="name" label="Name" />
      <Input name="email" label="Email" />
      <Input name="zipCode" label="Zip Code" />
    </Form>
  );
}
