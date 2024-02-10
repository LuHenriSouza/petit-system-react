import { createTheme } from '@mui/material';
import { cyan } from '@mui/material/colors';

export const MainTheme = createTheme({
    palette: {
        primary: {
            main: '#512da8',
            dark: '#6200ea',
            light: '#411d98',
            contrastText: '#efefef',

        },
        secondary: {
            main: '#6200ea',
            dark: cyan[800],
            light: cyan[500],
            contrastText: '#efefef',

        },
        background: {
            paper: 'rgb(28, 37, 54)',
            default: '#efefef',
        },
        info: {
            main: '#eee',
            light: '#6200ea',
            dark: '#411d98',
            contrastText: '#242105',
        }
    },
    components: {
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#ffffff'
                },
                listbox: {
                    maxHeight: 200
                }
            }
        }
    }
});