import {
    ArrowDropDown as ArrowDropDownIcon,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Menu,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import {
    useAppDispatch,
    useAppSelector,
} from '../../hooks/redux.hook';
import { toggleTheme } from '../../redux/theme.slice';
import { Link } from '../Link.component';
import { DesktopAuthButton } from './DesktopAuthButton.component';
import { DesktopNavbarItem } from './DesktopNavbarItem.component';
import { navBarItems } from './Navbar.component';

export function DesktopNavbar() {
    const dispatch = useAppDispatch();
    const { darkMode } = useAppSelector(
        (state) => state.themeReducer,
    );
    const [sellBuyAnchorElement, setSellBuyAnchorElement] =
        useState<null | HTMLElement>();
    const isSellBuyMenuOpen = Boolean(sellBuyAnchorElement);
    const theme = useTheme();
    const logoColor = darkMode ? '#ACACAC' : '#5C5C5C';
    const textColor = darkMode ? '#CCCCCC' : '#333333';
    const appBarBackgroundColor = darkMode ? '#000' : '#FFF';
    const linearGradient = {
        background: 'linear-gradient(#FD749B, #281AC8)',
    };
    const blogNavBarItem = navBarItems.find(
        (navBarItem) => navBarItem.href === '/blog',
    );

    if (!blogNavBarItem) {
        throw new Error('blogNavBarItem not found');
    }

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };
    const handleClickSellBuyMenu = (
        event: React.MouseEvent<HTMLElement>,
    ) => {
        setSellBuyAnchorElement(event.currentTarget);
    };
    const handleCloseSellBuyMenu = () => {
        setSellBuyAnchorElement(null);
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: appBarBackgroundColor,
                paddingX: 7,
                paddingY: 3,
                paddingBottom: 3,
                boxShadow: 'none',
            }}
        >
            <Toolbar>
                <Link
                    href={blogNavBarItem.href}
                    underline="none"
                    color={logoColor}
                >
                    <Typography
                        variant="h6"
                        noWrap
                        fontWeight={900}
                        sx={{
                            display: 'flex',
                            marginRight: 1,
                            [theme.breakpoints.down(470)]: {
                                display: 'none',
                                marginRight: 0,
                            },
                        }}
                    >
                        demo auth0 double render
                    </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                <Box
                    sx={{
                        flexGrow: 1,
                        display: {
                            xs: 'none',
                            md: 'flex',
                        },
                    }}
                >
                    <Tooltip
                        title={`${theme.palette.mode} mode`.toUpperCase()}
                    >
                        <IconButton
                            size="large"
                            onClick={handleThemeToggle}
                        >
                            {darkMode ? (
                                <Brightness4Icon color="primary" />
                            ) : (
                                <Brightness7Icon color="warning" />
                            )}
                        </IconButton>
                    </Tooltip>
                    {navBarItems.map((item, index) => {
                        return (
                            <DesktopNavbarItem
                                pathname={window.location.pathname}
                                {...item}
                                key={index}
                            />
                        );
                    })}
                </Box>
                <Stack direction="row" spacing={3}>
                    <Menu
                        open={isSellBuyMenuOpen}
                        anchorEl={sellBuyAnchorElement}
                        onClose={handleCloseSellBuyMenu}
                        elevation={0}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        sx={{
                            '& .MuiList-root': {
                                padding: 0,
                            },
                            '& .MuiPaper-root:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                width: 20,
                                height: 20,
                                backgroundSize: '20px 20px',
                                backgroundColor: 'red',
                                top: -18,
                                left: 10,
                            },
                            '& .MuiPaper-root': {
                                'marginTop': theme.spacing(1),
                                'overflow': 'visible',
                                '& .MuiMenuItem-root:hover': {
                                    backgroundColor: 'initial',
                                },
                                'borderWidth': 2,
                                'borderRadius': '7px',
                                'borderStyle': 'solid',
                                'borderColor': '#E0E0E0',
                            },
                        }}
                    >
                        {['Sell Crypto', 'Buy Crypto'].map(
                            (item, index) => (
                                <Link
                                    key={index}
                                    sx={{
                                        fontWeight: 500,
                                        display: 'block',
                                        paddingLeft: 3,
                                        paddingY: 0.5,
                                        width: 150,
                                        color: textColor,
                                        ...(item === 'Sell Crypto'
                                            ? {
                                                  borderTopLeftRadius:
                                                      '7px',
                                                  borderTopRightRadius:
                                                      '7px',
                                              }
                                            : {
                                                  borderBottomLeftRadius:
                                                      '7px',
                                                  borderBottomRightRadius:
                                                      '7px',
                                                  ...linearGradient,
                                              }),
                                    }}
                                    underline="none"
                                >
                                    {item}
                                </Link>
                            ),
                        )}
                    </Menu>
                    <Button
                        sx={{
                            '&:hover': { backgroundColor: 'initial' },
                            'color': textColor,
                        }}
                        disableElevation
                        onClick={handleClickSellBuyMenu}
                        endIcon={<ArrowDropDownIcon />}
                        disableRipple
                    >
                        Sell/Buy Crypto
                    </Button>
                    <DesktopAuthButton />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
