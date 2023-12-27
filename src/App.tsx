import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './routes';
import { AppDrawerProvider, AppThemeProvider } from './shared/contexts';
import { SideBar } from './shared/components';

export const App = () => {
  return (
    <AppThemeProvider>
      <AppDrawerProvider>
        <BrowserRouter>
          <SideBar>
            <AppRoutes />
          </SideBar>
        </BrowserRouter>
      </AppDrawerProvider >
    </AppThemeProvider>
  );
}