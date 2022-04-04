// routes
import Router from "./routes";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// theme

// ----------------------------------------------------------------------

export default function App() {
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
    <ThemeProvider theme={mdTheme}>
      <Router />
    </ThemeProvider>
  );
}
