import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';

export function DesktopAuthButton() {
    const { loginWithRedirect, logout, isAuthenticated, user } =
        useAuth0();
    const handleClick = () => {
        isAuthenticated ? logout() : loginWithRedirect();
    };

    console.log('Desktop Auth Button', user, isAuthenticated);

    return (
        <Button
            sx={{
                background: 'linear-gradient(#FD749B, #281AC8)',
                borderRadius: 100,
                paddingY: 2,
                paddingX: 5,
                color: 'white',
                fontWeight: 900,
            }}
            onClick={handleClick}
        >
            {isAuthenticated ? 'Logout' : 'Login'}
        </Button>
    );
}
