import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import RequestQuoteRoundedIcon from '@mui/icons-material/RequestQuoteRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';

export const items = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: (
            <DashboardRoundedIcon style={{
                fontSize: '12px'
            }} />
        )
    },
    {
        title: 'Products',
        path: '/produtos',
        icon: (
            <LocalOfferRoundedIcon style={{
                fontSize: '12px'
            }} />
        )
    },
    {
        title: 'Caixa',
        path: '/caixa',
        icon: (
            <ShoppingCartRoundedIcon style={{
                fontSize: '12px'
            }} />
        )
    },
    {
        title: 'Estoque',
        path: '/estoque',
        icon: (
            <ArchiveRoundedIcon style={{
                fontSize: '12px'
            }} />
        )
    },
    {
        title: 'Grupos',
        path: '/grupos',
        icon: (
            <FolderRoundedIcon style={{
                fontSize: '12px'
            }} />
        )
    },
    {
        title: 'Fechamentos',
        path: '/fechamentos',
        icon: (
            <RequestQuoteRoundedIcon style={{
                fontSize: '12px'
            }} />
        )
    },
    {
        title: 'Validades',
        path: '/validades',
        icon: (
            <DateRangeRoundedIcon style={{
                fontSize: '12px'
            }} />
        )
    }
];