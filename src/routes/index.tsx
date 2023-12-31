import { Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import {
    Sale,
    OutFlow,
    Products,
    Suppliers,
    Dashboard,
    ShowSales,
    NewProduct,
    NewFincash,
    SaleDetail,
    UpdateProduct,
} from '../pages';

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

            {/* Caixa / Vendas */}
            <Route path="/caixa" element={<Sale />} />
            <Route path="/caixa/novo" element={<NewFincash />} />
            <Route path="/vendas" element={<ShowSales />} />
            <Route path="/vendas/:id" element={<SaleDetail />} />

            {/* Saidas */}
            <Route path="/saidas" element={<OutFlow />} />

            {/* Fornecedores */}
            <Route path="/fornecedores" element={<Suppliers />} />

        </Routes>
    );
}