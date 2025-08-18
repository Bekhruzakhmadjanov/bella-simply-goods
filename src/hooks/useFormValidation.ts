import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues: Record<string, string>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateValue = useCallback((name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateRequired = useCallback((fields: string[]) => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (!values[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return { values, errors, updateValue, validateRequired, setValues };
};