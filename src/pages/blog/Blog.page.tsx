import { useAuth0 } from '@auth0/auth0-react';
import { Box } from '@mui/material';

export function Blog() {
    const { user, isAuthenticated } = useAuth0();

    console.log('Blog', user, isAuthenticated);

    return <Box>Blog</Box>;
}
