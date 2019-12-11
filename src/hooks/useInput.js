import { useState } from 'react';

export default function useInput(initialValue) {
  const [value, setValue] = useState(initialValue || '');

  function handleValueChange(e) {
    if (typeof e === 'string') {
      setValue(e);
      return;
    }
    const { value: newValue } = e.target;
    setValue(newValue);
  }

  return [value, handleValueChange];
}
