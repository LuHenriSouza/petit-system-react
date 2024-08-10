import SavingsIcon from '@mui/icons-material/Savings';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
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
        icon: (
            <ShoppingCartRoundedIcon fontSize='small' />
        )
    },
    {
        title: 'Produtos',
        path: '/produtos',
        icon: (
            <LocalOfferRoundedIcon fontSize='small' />
        )
    },
    {
        title: 'Estoque',
        path: '/estoque',
        icon: (
            <ArchiveRoundedIcon fontSize='small' />
        )
    },
    {
        title: 'Grupos',
        path: '/grupos',
        icon: (
            <FolderRoundedIcon fontSize='small' />
        )
    },
    {
        title: 'Saídas',
        path: '/saidas',
        icon: (
            <CurrencyExchangeIcon fontSize='small' />
        )
    },
    {
        title: 'Fechar Caixa',
        path: '/fechar',
        icon: (
            <AllInboxIcon fontSize='small' />
        )
    },
    {
        title: 'Validades',
        path: '/validades',
        icon: (
            <DateRangeRoundedIcon fontSize='small' />
        )
    },
    {
        title: 'Vendas',
        path: '/vendas',
        icon: (<LocalMallRoundedIcon fontSize='small' />)
    },
    {
        title: 'Fornecedores',
        path: '/fornecedores',
        icon: (<LocalShippingIcon fontSize='small' />)
    },
    {
        title: 'Promoções',
        path: '/promo',
        icon: (<SavingsIcon fontSize='small' />)
    },
    {
        title: 'Fechamentos',
        path: '/fechamentos',
        icon: (<RequestQuoteRoundedIcon fontSize='small' />)
    },
    {
        title: 'Vendas (todas)',
        path: '/vendas/admin',
        icon: (<QueryStatsIcon fontSize='small' />)
    },
    {
        title: 'Saídas (Produtos)',
        path: '/saida/produto',
        icon: (<CallMissedOutgoingIcon fontSize='small' />)
    }
];