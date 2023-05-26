import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { store } from './redux/store';

const {
    VITE_AUTH0_CLIENT_ID,
    VITE_AUTH0_DOMAIN,
    VITE_AUTH0_AUDIENCE,
} = import.meta.env;

ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
).render(
    <Provider store={store}>
        <Auth0Provider
            domain={VITE_AUTH0_DOMAIN}
            clientId={VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: VITE_AUTH0_AUDIENCE,
                scope: 'openid profile email',
            }}
        >
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </Auth0Provider>
    </Provider>,
);
