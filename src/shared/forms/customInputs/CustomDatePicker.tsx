import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useEffect, useState } from 'react';
import { ptBR as dateFnsPtBR } from 'date-fns/locale';
import { ptBR as MUIptBR } from '@mui/x-date-pickers/locales';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { startOfWeek, endOfWeek, subDays, startOfMonth, endOfMonth, addMonths, subMonths, endOfDay, startOfDay } from 'date-fns';

const shortcutsItems: PickersShortcutsItem<DateRange<Date>>[] = [
	{
		label: 'Semana Atual',
		getValue: () => {
			const today = new Date();
			return [startOfWeek(today), endOfWeek(today)];
		},
	},
	{
		label: 'Semana Passada',
		getValue: () => {
			const today = new Date();
			const prevWeek = subDays(today, 7);
			return [startOfWeek(prevWeek), endOfWeek(prevWeek)];
		},
	},
	{
		label: 'Últimos 7 Dias',
		getValue: () => {
			const today = new Date();
			return [subDays(today, 7), today];
		},
	},
	{
		label: 'Mês Passado', // Novo atalho
		getValue: () => {
			const today = new Date();
			const startOfLastMonth = startOfMonth(addMonths(today, -1));
			const endOfLastMonth = endOfMonth(addMonths(today, -1));
			return [startOfLastMonth, endOfLastMonth];
		},
	},
	{
		label: 'Mês Atual',
		getValue: () => {
			const today = new Date();
			return [startOfMonth(today), endOfMonth(today)];
		},
	},
	{
		label: 'Últimos 6 Meses', // Novo atalho para os últimos 6 meses
		getValue: () => {
			const today = new Date();
			const sixMonthsAgo = subMonths(today, 6); // 6 meses atrás
			return [startOfMonth(sixMonthsAgo), endOfMonth(today)];
		},
	},
	{ label: 'Resetar', getValue: () => [null, null] },
];

interface IProps {
	onChange?: (newValue: DateRange<Date>) => void;
	loading?: boolean;
}

export const CustomDatePicker: React.FC<IProps> = ({ onChange, loading }) => {

	const today = new Date();

	const [value, setValue] = useState<DateRange<Date>>([
		startOfMonth(today),
		endOfMonth(today)
	]);

	useEffect(() => {
		const divs = Array.from(document.querySelectorAll('div'));
		const licenseMessage = divs.find(div => div.textContent === 'MUI X Missing license key');

		if (licenseMessage) {
			licenseMessage.remove();
		}
	}, []);

	const handleChange = (newValue: DateRange<Date>) => {
		if (newValue[0])
			newValue[0] = startOfDay(newValue[0]);

		if (newValue[1])
			newValue[1] = endOfDay(newValue[1]);
		setValue(newValue);
		if (onChange)
			onChange(newValue);
	}

	return (
		<LocalizationProvider
			dateAdapter={AdapterDateFns}
			adapterLocale={dateFnsPtBR}
			localeText={MUIptBR.components.MuiLocalizationProvider.defaultProps.localeText}
		>
			<StaticDateRangePicker
				disabled={loading}
				// loading={loading}
				slotProps={{
					shortcuts: {
						items: shortcutsItems,
					},
					actionBar: { actions: [] },
				}}
				sx={{
					backgroundColor: '#fff'
				}}
				calendars={2}
				value={value}
				onChange={(newValue) => handleChange(newValue)}
			/>
		</LocalizationProvider>
	);
};
