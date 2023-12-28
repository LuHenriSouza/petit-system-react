import { Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { Dashboard, Products } from '../pages';

export const AppRoutes = () => {
    const { toggleDrawerOpen } = useDrawerContext();
    return (
        <Routes>
            <Route path="/" element={<Button variant='contained' color='primary' onClick={toggleDrawerOpen}>test</Button>} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}