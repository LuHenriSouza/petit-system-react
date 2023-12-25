import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './routes';
import { AppThemeProvider } from './shared/contexts';
import { SideBar } from './shared/components';

export const App = () => {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        
        <SideBar/>

        <AppRoutes />
      </BrowserRouter>
    </AppThemeProvider>
  );
}