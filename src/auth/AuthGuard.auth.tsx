import { useAuth0 } from '@auth0/auth0-react';
import { PropsWithChildren, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export function AuthGuard({
    children = <Outlet />,
}: PropsWithChildren) {
    const { isAuthenticated, user } = useAuth0();
    const navigate = useNavigate();

    console.log('Auth Guard', isAuthenticated, user);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            // TODO: should I show a notification about login or not?
        }
    }, []);

    return <>{isAuthenticated && children}</>;
}
