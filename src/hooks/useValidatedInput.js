import { useState, useEffect } from 'react';
import useInput from './useInput';

export default function useValidatedInput(initialValue, regex) {
  const [value, handleValueChange] = useInput(initialValue);
  const [valueIsValid, setValueIsValid] = useState(false);

  useEffect(() => {
    setValueIsValid(regex.test(value));
  }, [value, regex]);

  return [value, valueIsValid, handleValueChange];
}
