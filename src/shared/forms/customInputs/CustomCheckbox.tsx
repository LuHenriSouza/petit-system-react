import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

export interface ICheckItens {
	label: string,
	defaultChecked?: boolean,
}

interface IVSelectProps {
	menuItens: ICheckItens[],
	flexDirection?: 'column' | 'column-reverse' | 'row' | 'row-reverse'
	/* onValueChange?: (selectedValue: string) => void; */
}

export const CustomCheckbox: React.FC<IVSelectProps> = ({ menuItens, flexDirection = 'row' }) => {
	return (
		<FormGroup>
			<Box display={'flex'} flexDirection={flexDirection}>
				{
					menuItens.map((item) =>
						<FormControlLabel
							key={item.label}
							label={item.label}
							control={<Checkbox defaultChecked={item.defaultChecked} />}
						/>
					)
				}
			</Box>
		</FormGroup>
	);
};