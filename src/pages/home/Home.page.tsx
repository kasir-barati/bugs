import { useAuth0 } from '@auth0/auth0-react';
import { Box } from '@mui/material';
import bug from 'assets/Untitled.png';
import { Image } from '../../components/Image.component';

export function Home() {
    const { user, isAuthenticated } = useAuth0();

    console.log('Home', user, isAuthenticated);

    return (
        <Box>
            BUG: <br /> <Image src={bug} />
        </Box>
    );
}
