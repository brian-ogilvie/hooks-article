import { useState } from 'react';

export default function useForm(onSubmit, initialData = {}) {
  const [formData, setFormData] = useState(initialData);

  function updateField({ target }) {
    const { name, value } = target;
    setFormData(current => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  function resetForm() {
    setFormData(initialData);
  }

  return { formData, updateField, resetForm, handleSubmit };
}
