// material
import { Box, Container, Typography } from "@mui/material";
// components
import Page from "../components/Page";

// ----------------------------------------------------------------------

export default function Dashboard() {
  return (
    <Page title="Pesaje">
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
      </Container>
    </Page>
  );
}
