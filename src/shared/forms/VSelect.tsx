import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useField } from '@unform/core';
import { FormHelperText } from '@mui/material';


export interface IMenuItens {
    text: string
    value: string
}


interface IVSelectProps {
    menuItens: IMenuItens[],
    label: string,
    name: string,
    messageError?: string,
    defaultSelected?: number,
    onValueChange?: (selectedValue: string) => void;
}

export const VSelect: React.FC<IVSelectProps> = ({ menuItens, label, name, defaultSelected, messageError, onValueChange }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    const [value, setValue] = useState(defaultSelected ? defaultSelected : defaultValue || '');

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);
        error && clearError();

        onValueChange?.(event.target.value);
    };


    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue),
        });
    }, [registerField, fieldName, value]);

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth error={!!error}>

                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    inputProps={{
                        MenuProps: {
                            MenuListProps: {
                                sx: {
                                    maxHeight: 250,
                                    overflowY: 'auto',
                                    backgroundColor: '#fff',
                                }
                            }
                        }
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label={label}
                    onChange={handleChange}
                >
                    {
                        menuItens.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                                {item.text}
                            </MenuItem>
                        ))
                    }
                </Select>
                <FormHelperText>{!!error && messageError ? messageError : error}</FormHelperText>
            </FormControl>
        </Box >
    );
}