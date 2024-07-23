import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, SxProps } from "@mui/material";
import { useState } from "react";

interface IVRadioProps {
	menuItens: { label: string, value: string }[],
	groupLabel?: string,
	sx?: SxProps,
	flexDirection?: 'column' | 'column-reverse' | 'row' | 'row-reverse',
	size?: 'small' | 'medium',
	defaultChecked?: string,
	onValueChange?: (selectedValue: string) => void;
}

export const CustomRadio: React.FC<IVRadioProps> = ({ menuItens, groupLabel, flexDirection = 'column', size = 'small', defaultChecked = menuItens[0].value, onValueChange, sx }) => {

	const [value, setValue] = useState(defaultChecked);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);
		onValueChange?.(event.target.value);
	};


	return (
		<FormControl sx={sx}>
			<FormLabel id="demo-controlled-radio-buttons-group">{groupLabel}</FormLabel>
			<RadioGroup
				aria-labelledby="demo-controlled-radio-buttons-group"
				name="controlled-radio-buttons-group"
				value={value}
				onChange={handleChange}
			>
				{
					menuItens.map((item) =>
						<Box key={item.value} display={'flex'} flexDirection={flexDirection}>
							<FormControlLabel value={item.value} control={<Radio size={size} />} label={item.label} />
						</Box>
					)
				}
			</RadioGroup>
		</FormControl>
	);
};