import { useEffect, useState } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useField } from '@unform/core';


type TVTextFieldProps = TextFieldProps & {
  name: string;
}
export const VTextField: React.FC<TVTextFieldProps> = ({ name, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

  const [value, setValue] = useState(name == 'price' ? 'R$ 0.00' : defaultValue || '');


  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);


  return (
    <TextField
      fullWidth
      error={!!error}
      helperText={error}
      defaultValue={defaultValue}

      value={value || ''}

      onChange={name == 'price' ? (event) => {
        let value = event.target.value.replace(/[^0-9]/g, '');
        value = "R$ " + (Number(value) / 100).toFixed(2);
        setValue(value);
      } : e => setValue(e.target.value)}

      {...rest}
      
      onKeyDown={(e) => {error ? clearError() : undefined; rest.onKeyDown?.(e)}}
    />
  );
};