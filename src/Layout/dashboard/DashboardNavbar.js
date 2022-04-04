import PropTypes from "prop-types";
// material
import { styled } from "@mui/material/styles";
import {
  Toolbar,
  IconButton,
  Typography,
  AppBar as MuiAppBar,
} from "@mui/material";

import { useLocation } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import sidebarConfig from "./SidebarConfig";

const drawerWidth = 240;

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ open, setOpen }) {
  const { pathname } = useLocation();

  const obtenerTitulo = () => {
    const ruta = sidebarConfig.find((sidebar) => sidebar.path === pathname);
    return ruta === undefined ? "Error" : ruta.title;
  };

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

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={setOpen}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {obtenerTitulo()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
