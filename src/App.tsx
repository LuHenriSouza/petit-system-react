import { BrowserRouter } from 'react-router-dom';
import './shared/services/translations/Yup';

import { AppRoutes } from './routes';
import { AppDrawerProvider, AppThemeProvider } from './shared/contexts';
import { Login, SideBar } from './shared/components';
import { AuthProvider } from './shared/contexts/AuthContext';


export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Login>
          <AppDrawerProvider>
            <BrowserRouter>
              <SideBar>
                <AppRoutes />
              </SideBar>
            </BrowserRouter>
          </AppDrawerProvider >
        </Login>
      </AppThemeProvider>
    </AuthProvider>
  );
}