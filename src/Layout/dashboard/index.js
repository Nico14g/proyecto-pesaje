import { useState } from "react";
import { Outlet } from "react-router-dom";
// material

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

//
import useStore from "../../store/store";
import { useAuth } from "../../Auth/Auth";
import CssBaseline from "@mui/material/CssBaseline";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import LogoOnlyLayout from "../LogoOnlyLayout";
import NotFound from "../../vistas/NotFound";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  height: "100vh",

  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const RootStyle = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});
// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const open = useStore((state) => state.open);
  const setOpen = useStore((state) => state.setOpen);
  const { userData } = useAuth();

  const mdTheme = createTheme({
    palette: {
      type: "light",
      primary: {
        main: "#1565c0",
      },
      secondary: {
        main: "#4BC74F",
      },
    },
  });

  if (userData === undefined || userData === null)
    return (
      <div>
        <LogoOnlyLayout />
        <NotFound />
      </div>
    );

  return (
    <RootStyle>
      <ThemeProvider theme={mdTheme}>
        <CssBaseline />
        <DashboardNavbar open={open} setOpen={setOpen} />
        <DashboardSidebar open={open} setOpen={setOpen} />

        <MainStyle>
          <Outlet open={open} />
        </MainStyle>
      </ThemeProvider>
    </RootStyle>
  );
}
