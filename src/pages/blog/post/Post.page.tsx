import { useAuth0 } from '@auth0/auth0-react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export function Post() {
    const { user, isAuthenticated } = useAuth0();
    const { postId } = useParams();

    console.log('Post', user, isAuthenticated);

    if (!postId) {
        // TODO: Do something better
        throw 'postId does not exists in the url';
    }

    return <Box>A single post</Box>;
}
