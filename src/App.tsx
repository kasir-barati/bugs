import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AppRoutes } from './AppRoutes';
import { Navbar } from './components/appbar/Navbar.component';
import { ThemeProvider } from './providers/Theme.provider';

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <CssBaseline />
                <Navbar />
                <AppRoutes />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
