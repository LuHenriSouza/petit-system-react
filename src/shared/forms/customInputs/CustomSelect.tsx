import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormHelperText } from '@mui/material';


export interface IMenuItens {
    text: string
    value: string
}

interface IVSelectProps {
    menuItens: IMenuItens[],
    label?: string,
    helperText?: string,
    defaultSelected?: number,
    onValueChange?: (selectedValue: string) => void;
}

export const CustomSelect: React.FC<IVSelectProps> = ({ menuItens, label, defaultSelected, helperText, onValueChange, }) => {

    const [value, setValue] = useState(defaultSelected !== undefined ? menuItens[defaultSelected].value : '');

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);
        onValueChange?.(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
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
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        </Box >
    );
}