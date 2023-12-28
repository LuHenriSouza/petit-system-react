import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { TopBar } from '../components';

interface ILayoutMainProps {
    children: React.ReactNode;
    title: string
    subTitle: string
}

export const LayoutMain: React.FC<ILayoutMainProps> = ({ children, title, subTitle }) => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Box height={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
            <Box>
                <Box>
                    <TopBar />
                </Box>
            </Box>
            <Box marginLeft={2} marginTop={0}>
                <Box padding={2} display={'flex'} height={theme.spacing(8)} flexDirection={'column'}>
                    <Typography variant={smDown ? 'h4' : 'h3'} whiteSpace={'nowrap'} textOverflow={'ellipsis'}>
                        {title}
                    </Typography>
                    <Typography variant={'h6'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} sx={{ ml: 2, fontWeight: 400, color: 'rgba(0,0,0,0.6)' }}>
                        {subTitle}
                    </Typography>
                </Box>
                <Box flex={1} margin={1} marginTop={3}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};