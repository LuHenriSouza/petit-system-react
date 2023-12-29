import { createContext, useContext } from 'react';
import { Box, ThemeProvider } from '@mui/material';

import { MainTheme } from './../themes';

interface IThemeProviderProps {
    children: React.ReactNode
}

const ThemeContext = createContext({});

export const useAppThemeContext = () => {
    return useContext(ThemeContext);
}

export const AppThemeProvider: React.FC<IThemeProviderProps> = ({ children }) => {

    return (
        <ThemeContext.Provider value={MainTheme}>
            <ThemeProvider theme={MainTheme}>
                <Box width="100%" height="100%" bgcolor={MainTheme.palette.background.default}>
                    {children}
                </Box>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};