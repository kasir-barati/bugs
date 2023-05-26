import { useAuth0 } from '@auth0/auth0-react';
import { Box } from '@mui/material';

export function CreatePost() {
    const { isAuthenticated } = useAuth0();

    console.log('CreatePost', isAuthenticated);

    return <Box>Create Post</Box>;
}
