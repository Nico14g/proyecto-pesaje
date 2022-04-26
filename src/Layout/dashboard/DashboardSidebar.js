import PropTypes from "prop-types";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import {
  Toolbar,
  Divider,
  IconButton,
  Drawer as MuiDrawer,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import NavSection from "../../components/NavSection";
//
import sidebarConfig from "./SidebarConfig";
import logo from "../../assets/agricultura.png";
// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};
const drawerWidth = 240;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: drawerWidth,
  },
}));

export default function DashboardSidebar({ open, setOpen }) {
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

  return (
    <RootStyle>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "#F6F6F6",
            px: [1],
          }}
        >
          <img src={logo} alt="logo" width={40} style={{ marginRight: 5 }} />

          <Typography style={{ fontWeight: "bolder" }}>
            Gestión Cosecha
          </Typography>
          <IconButton onClick={setOpen}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <NavSection navConfig={sidebarConfig} openSidebar={open} />
      </Drawer>
    </RootStyle>
  );
}
