import { useState, useEffect } from 'react';

const validPatterns = {
  EMAIL: /^\w[^ ]*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  NOT_EMPTY: /\S+/,
  ZIP: /^\d{5}(-\d{4})?$/,
};

function checkValidity(value, type) {
  if (!value) return false;
  const pattern = validPatterns[type];
  return pattern && pattern.test(value);
}

export const types = {
  email: 'EMAIL',
  notEmpty: 'NOT_EMPTY',
  zip: 'ZIP',
};

export default function useFormValidation(formData, schema) {
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    setFormIsValid(() => {
      if (!schema || !Object.keys(schema).length) return true;
      if (!Object.keys(formData).length) return false;
      return Object.keys(schema).every(key => {
        return checkValidity(formData[key], schema[key]);
      });
    });
  }, [formData, schema]);

  return { formIsValid };
}
