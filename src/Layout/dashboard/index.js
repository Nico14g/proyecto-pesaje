import { useState } from "react";
import { Outlet } from "react-router-dom";
// material

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

//

import CssBaseline from "@mui/material/CssBaseline";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
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
  const [open, setOpen] = useState(false);
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
  return (
    <RootStyle>
      <ThemeProvider theme={mdTheme}>
        <CssBaseline />
        <DashboardNavbar open={open} setOpen={() => setOpen((open) => !open)} />
        <DashboardSidebar
          open={open}
          setOpen={() => setOpen((open) => !open)}
        />

        <MainStyle>
          <Outlet />
        </MainStyle>
        {/* <Box sx={{ flexGrow: 1 }} /> */}
      </ThemeProvider>
    </RootStyle>
  );
}
