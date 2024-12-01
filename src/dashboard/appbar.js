import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import { mainListItems, secondaryListItems } from "./listItems";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from 'jwt-decode'
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = function () {
    localStorage.removeItem("token");
    navigate("/login");
  };
  let heading = "";
  switch (location.pathname) {
    case "/":
      heading = "Dashboard";
      break;
    case "/orders":
      heading = "Orders";
      break;
    case "/newOrder":
      heading = "New Order";
      break;
    case "/newOrder/selectItems":
      heading = "New Order";
      break;
    case "/newOrder/invoice":
      heading = "New Order";
      break;
    case "/customers":
      heading = "Customers";
      break;
    case "/items":
      heading = "Items";
      break;
    case "/invoice":
      heading = "Invoice";
      break;
    case "/admin":
      heading = "Admin";
      break;
    case "/newItem":
      heading = "New Item";
      break;
    default:
      heading = "Not Found";
      break;
  }

  if(location.pathname.startsWith("/customerInfo")){
    heading = "Customer Info"
  }
  if(location.pathname.startsWith("/editOrder")){
    heading = "Edit Order"
  }
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  function isTokenValid(token) {
    if (!token) return false;
  
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
  
      // Check if the token has expired by comparing the `exp` field with current time
      if (decodedToken.exp < currentTime) {
        return false; // Token is expired
      }
  
      return true; // Token is still valid
    } catch (error) {
      console.error('Error decoding token:', error);
      return false; // Token is invalid or cannot be decoded
    }
  }
  
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !isTokenValid(token)) {
      navigate("/login");
    }
  }, [location]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              // pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton onClick={toggleDrawer} sx={{
                ...(!open && { display: "none" }),
                color: "white"
              }}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {heading}
            </Typography>
            <IconButton color="inherit" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              px: [1],
            }}
          >
            <img src={`/vortexLogo.jpg`} style={{height: "47%", width: "59%"}} alt="My Logo" />
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1, borderColor: "#484343" }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="90%" sx={{ mt: 4, mb: 4 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}
