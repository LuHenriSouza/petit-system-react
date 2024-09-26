// import SavingsIcon from '@mui/icons-material/Savings';
// import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import RequestQuoteRoundedIcon from '@mui/icons-material/RequestQuoteRounded';

export const items = [
    {
        title: 'Caixa',
        path: '/caixa',
        icon: (<ShoppingCartRoundedIcon fontSize='small' />),
        role: ['employee', 'admin']
    },
    {
        title: 'Produtos',
        path: '/produtos',
        icon: (<LocalOfferRoundedIcon fontSize='small' />),
        role: ['employee', 'admin']
    },
    {
        title: 'Estoque',
        path: '/estoque',
        icon: (<ArchiveRoundedIcon fontSize='small' />),
        role: ['admin']
    },
    {
        title: 'Grupos',
        path: '/grupos',
        icon: (<FolderRoundedIcon fontSize='small' />),
        role: ['employee', 'admin']
    },
    {
        title: 'Saídas',
        path: '/saidas',
        icon: (<CurrencyExchangeIcon fontSize='small' />),
        role: ['employee', 'admin']
    },
    {
        title: 'Fechar Caixa',
        path: '/fechar',
        icon: (<AllInboxIcon fontSize='small' />),
        role: ['employee', 'admin']
    },
    {
        title: 'Validades',
        path: '/validades',
        icon: (<DateRangeRoundedIcon fontSize='small' />),
        role: ['employee', 'admin']
    },
    {
        title: 'Vendas',
        path: '/vendas',
        icon: (<LocalMallRoundedIcon fontSize='small' />),
        role: ['employee', 'admin']
    },
    {
        title: 'Fornecedores',
        path: '/fornecedores',
        icon: (<LocalShippingIcon fontSize='small' />),
        role: ['admin']
    },
    // {
    //     title: 'Promoções',
    //     path: '/promo',
    //     icon: (<SavingsIcon fontSize='small' />),
    //     role: ['admin']
    // },
    {
        title: 'Fechamentos',
        path: '/fechamentos',
        icon: (<RequestQuoteRoundedIcon fontSize='small' />),
        role: ['admin']
    },
    // {
    //     title: 'Vendas (todas)',
    //     path: '/vendas/admin',
    //     icon: (<QueryStatsIcon fontSize='small' />),
    //     role: ['admin']
    // },
    {
        title: 'Saídas (Produtos)',
        path: '/saida/produto',
        icon: (<CallMissedOutgoingIcon fontSize='small' />),
        role: ['employee', 'admin']
    },
    {
        title: 'Boletos',
        path: '/boletos',
        icon: (<AccountBalanceIcon fontSize='small' />),
        role: ['admin']
    }
];