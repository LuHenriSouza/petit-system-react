import { Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { Dashboard, Products, NewProduct, UpdateProduct, Sale, NewFincash } from '../pages';

export const AppRoutes = () => {
    const { toggleDrawerOpen } = useDrawerContext();
    return (
        <Routes>
            <Route path="/" element={<Button variant='contained' color='primary' onClick={toggleDrawerOpen}>test</Button>} />
            <Route path="/dashboard" element={<Dashboard />} />9

            {/* Produtos */}
            <Route path="/produtos" element={<Products />} />
            <Route path="/produtos/novo" element={<NewProduct />} />
            <Route path="/produtos/edit/:id" element={<UpdateProduct />} />

            {/* Caixa */}
            <Route path="/caixa" element={<Sale />} />
            <Route path="/caixa/novo" element={<NewFincash />} />

        </Routes>
    );
}