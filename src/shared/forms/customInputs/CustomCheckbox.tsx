import { Box, Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material';
import { useEffect, useState } from 'react';

export interface ICheckItens {
    id: string;
    label: string;
    defaultChecked?: boolean;
}

interface IVCheckProps {
    disabled?: boolean;
    menuItens: ICheckItens[];
    defaultChecked?: boolean;
    flexDirection?: 'column' | 'column-reverse' | 'row' | 'row-reverse';
    onValueChange?: (selectedValues: string[]) => void;
}

export const CustomCheckbox: React.FC<IVCheckProps> = ({ menuItens, flexDirection = 'row', disabled, onValueChange, defaultChecked = false }) => {
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialCheckedState: Record<string, boolean> = {};
        menuItens.forEach((item) => {
            initialCheckedState[item.id] = item.defaultChecked ?? false;
        });
        setChecked(initialCheckedState);
    }, []);

    const handleChange = (key: string, isChecked: boolean) => {
        const updatedChecked = {
            ...checked,
            [key]: isChecked,
        };
        setChecked(updatedChecked);

        const selectedKeys = Object.keys(updatedChecked).filter((key) => updatedChecked[key]);
        console.log('selected: ' + selectedKeys)
        onValueChange?.(selectedKeys);
    };

    return (
        <FormControl>
            <FormGroup>
                <Box display={'flex'} flexDirection={flexDirection}>
                    {menuItens.map((item) => (
                        <FormControlLabel
                            key={item.id}
                            label={item.label}
                            control={
                                <Checkbox
                                    onChange={(e) => handleChange(item.id, e.target.checked)}
                                    checked={checked[item.id] ?? defaultChecked}
                                    disabled={disabled}
                                />
                            }
                        />
                    ))}
                </Box>
            </FormGroup>
        </FormControl>
    );
};
