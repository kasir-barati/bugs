import { Stack, Typography } from '@mui/material';
import { useAppSelector } from '../../hooks/redux.hook';
import { Link } from '../Link.component';
import { NavbarItem } from './Navbar.component';

// TODO: The border bottom does not work properly
export function DesktopNavbarItem(
    item: NavbarItem & { pathname: string },
) {
    const { darkMode } = useAppSelector(
        (state) => state.themeReducer,
    );
    const textColor = darkMode ? '#CCCCCC' : '#333333';

    return (
        <Link
            href={item.href}
            sx={{
                display: 'flex',
                textDecoration: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                marginX: 2,
                color: textColor,
            }}
        >
            <Stack
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Typography>{item.text}</Typography>
            </Stack>
        </Link>
    );
}
