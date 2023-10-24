import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { AppBar, Toolbar, IconButton, MenuItem, Menu } from "@mui/material";
import { ShoppingCart, AccountCircle } from "@mui/icons-material";
import { makeStyles } from '@mui/styles';
import SearchBox from "./SearchBox";
import logo from "../logo.png";
import { logout } from "../redux/slices/userSlice";


const useStyles = makeStyles((theme) => ({    
    appBar: {
        backgroundColor: "#212121",
    },
    grow: {
        flexGrow: 1,
    },
    menuItem: {
        minWidth: 180,
    },
    link: {
        textDecoration: "none",
        color: "#fff",
    },

}));

const Header = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    let history = useHistory()
    const userLogin = useSelector((state) => state.user);
    // const cart = useSelector((state) => state.cart);

    const { userDetails } = userLogin;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleMenuClose();
        history.push('/login');
        window.location.reload(); // Reload the page


    };

    return (
        <div className={classes.grow}>
            <AppBar position="static" className={classes.appBar}  >
                <Toolbar>
                    <a href="/" className={classes.link}>
                        <img
                            src={logo}
                            alt="FooTshop"
                            style={{
                                height: 60,
                            }}
                        />
                    </a>
                    <div style={{ marginLeft: "5vw" }}>
                        <SearchBox />
                    </div>
                    <div className={classes.grow} />

                    <div>
                        <IconButton
                            aria-label="show cart items"
                            color="inherit"
                            component={Link}
                            to="/cart"
                        >
                            <ShoppingCart/>
                        </IconButton>
                    </div>
                    {userDetails ? (
                        <>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                                style={{ color: "white" }}
                            >
                                <AccountCircle />
                            </IconButton>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={open}
                                onClose={handleMenuClose}
                            >
                                <MenuItem
                                    className={classes.menuItem}
                                    component={Link}
                                    to="/profile"
                                    onClick={handleMenuClose}
                                >
                                    Profile
                                </MenuItem>

                                <MenuItem className={classes.menuItem} onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <div>
                            <IconButton
                                aria-label="login"
                                color="inherit"
                                component={Link}
                                to="/login"
                                style={{ color: "white" }}
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;