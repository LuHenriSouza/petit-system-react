import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import RequestQuoteRoundedIcon from '@mui/icons-material/RequestQuoteRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';

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
        title: 'Fechamentos',
        path: '/fechamentos',
        icon: (
            <RequestQuoteRoundedIcon fontSize='small' />
        )
    },
    {
        title: 'Validades',
        path: '/validades',
        icon: (
            <DateRangeRoundedIcon fontSize='small' />
        )
    }
];