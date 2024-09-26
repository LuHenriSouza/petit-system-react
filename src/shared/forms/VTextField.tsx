import { useEffect, useState } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useField } from '@unform/core';
import { nToBRL } from '../services/formatters';


type TVTextFieldProps = TextFieldProps & {
  name: string;
  valueDefault?: string;
  cash?: boolean
}

export const VTextField: React.FC<TVTextFieldProps> = ({ name, valueDefault, cash, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

  const [value, setValue] = useState(valueDefault ? valueDefault : cash ? 'R$ 0,00' : (defaultValue || ''));


  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);

  const handleCashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/[^0-9]/g, '');
    const numericValue = Number(rawValue) / 100;
    const formattedValue = nToBRL(numericValue);
    setValue(formattedValue);
    rest.onChange?.(event);
  };

  return (
    <TextField
      fullWidth
      error={!!error}
      helperText={error}
      defaultValue={defaultValue}

      autoComplete="off"

      value={value || ''}

      {...rest}

      onChange={cash ? handleCashChange : (e) => { setValue(e.target.value); rest.onChange?.(e); }}


      onKeyDown={(e) => { error ? clearError() : undefined; rest.onKeyDown?.(e) }}
    />
  );
};