import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { TopBar } from '../components';

interface ILayoutMainProps {
    children: React.ReactNode;
    title: string
}

export const LayoutMain: React.FC<ILayoutMainProps> = ({ children, title }) => {
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
                <Box padding={1} display={'flex'} alignItems={'center'} height={theme.spacing(5)}>
                    <Typography variant={smDown ? 'h6' : 'h5'} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>
                        {title}
                    </Typography>
                </Box>
                <Box>
                    Barra de Ferramentas
                </Box>
                <Box flex={1} overflow={'auto'}>
                    {children}
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </Box>
            </Box>
        </Box>
    );
};