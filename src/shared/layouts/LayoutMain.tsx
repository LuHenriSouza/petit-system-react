import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TopBar } from '../components';

interface ILayoutMainProps {
    children: React.ReactNode;
    title: string
}

export const LayoutMain: React.FC<ILayoutMainProps> = ({ children, title }) => {
    return (
        <Box height={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
            <Box>
                <Box>
                    <TopBar />
                </Box>
            </Box>
            <Box marginLeft={2} marginTop={5}>
                <Box padding={1}>
                    <Typography variant='h4' component={'h4'}>
                        {title}
                    </Typography>
                </Box>
                <Box>
                    Barra de Ferramentas
                </Box>
                <Box>
                    {children}
                </Box>
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
    );
};