import { useState, useEffect } from 'react';

const validPatterns = {
  email: /^\w[^ ]*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  notEmpty: /\S+/,
  zipCode: /^\d{5}(-\d{4})?$/,
};

function checkValidity(value, type) {
  if (!value) return false;
  const pattern = validPatterns[type];
  return pattern && pattern.test(value);
}

export default function useFormValidation(formData, validators) {
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    setFormIsValid(() => {
      if (!validators || !Object.keys(validators).length) return true;
      if (!Object.keys(formData).length) return false;
      return Object.keys(validators).every(key => {
        return checkValidity(formData[key], validators[key]);
      });
    });
  }, [formData, validators]);

  return { formIsValid };
}
