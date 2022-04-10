import PropTypes from "prop-types";
// material
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import {
  Toolbar,
  IconButton,
  Typography,
  AppBar as MuiAppBar,
  Badge,
  Box,
  Divider,
  Button,
  Popover,
} from "@mui/material";

import MenuPopover from "./MenuPopover";
import { useLocation } from "react-router-dom";
import Account from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import sidebarConfig from "./SidebarConfig";
import useAuth from "../../Auth/Auth";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

const drawerWidth = 240;

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ open, setOpen }) {
  const { pathname } = useLocation();
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const divRef = useRef();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  }

  useEffect(() => {
    setAnchorEl(divRef.current);
  }, [divRef]);

  const openOptions = Boolean(anchorEl);
  const id = openOptions ? "simple-popover" : undefined;

  const capitalizar = (title) => {
    const arr = title.split(" ");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
  };
  const obtenerTitulo = () => {
    const ruta = sidebarConfig.find((sidebar) => sidebar.path === pathname);
    return ruta === undefined ? "Error" : capitalizar(ruta.title);
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
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <IconButton
                style={{ color: "white" }}
                {...bindTrigger(popupState)}
              >
                <Account />
              </IconButton>
              <MenuPopover
                id={id}
                open={openOptions}
                {...bindPopover(popupState)}
                sx={{ width: 220 }}
              >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                  <Typography variant="subtitle1" noWrap>
                    {userData.firstName}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ p: 2, pt: 1.5 }}>
                  <Button
                    color="inherit"
                    fullWidth
                    onClick={() =>
                      logout() && navigate("/login", { replace: true })
                    }
                    variant="outlined"
                  >
                    Cerrar Sesión
                  </Button>
                </Box>
              </MenuPopover>
            </div>
          )}
        </PopupState>
      </Toolbar>
    </AppBar>
  );
}
