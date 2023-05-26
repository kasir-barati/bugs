import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from '@mui/material';
import { PropsWithChildren, useMemo } from 'react';
import { useAppSelector } from '../hooks/redux.hook';

export function ThemeProvider({ children }: PropsWithChildren) {
    const { darkMode } = useAppSelector(
        (state) => state.themeReducer,
    );
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                },
            }),
        [darkMode],
    );

    return (
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    );
}
