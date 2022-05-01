import { useTheme, styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Grid,
} from "@mui/material";
import Iconify from "../Iconify";
import MainCard from "../MainCard";
import SkeletonTotalPesaje from "./SkeletonTotalPesaje";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: "#fff",
  overflow: "hidden",
  position: "relative",
  "&>div": {
    position: "relative",
    zIndex: 5,
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: "#1565c0",
    borderRadius: "50%",
    zIndex: 1,
    top: -85,
    right: -95,
    [theme.breakpoints.down("sm")]: {
      top: -105,
      right: -140,
    },
  },
  "&:before": {
    content: '""',
    position: "absolute",
    zIndex: 1,
    width: 210,
    height: 210,
    background: "#1565c0",
    borderRadius: "50%",
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down("sm")]: {
      top: -155,
      right: -70,
    },
  },
}));

export default function TotalCategoriasCard(props) {
  const { isLoading, cantidadCategorias } = props;
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonTotalPesaje />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }} style={{ height: 110, marginTop: 10 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      backgroundColor: "transparent",
                      color: "#fff",
                      width: 70,
                      height: 70,
                    }}
                  >
                    <Grid container>
                      <Grid item xs={6}>
                        <Iconify
                          icon="mdi:fruit-cherries"
                          width={30}
                          height={30}
                          style={{ color: "#fff" }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Iconify
                          icon="mdi:fruit-grapes"
                          width={30}
                          height={30}
                          style={{ color: "#fff" }}
                        />
                      </Grid>
                      <Grid item xs={3}></Grid>
                      <Grid item xs={9}>
                        <Iconify
                          icon="mdi:fruit-pear"
                          width={30}
                          height={30}
                          style={{ color: "#fff" }}
                        />
                      </Grid>
                    </Grid>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45,
                  }}
                  primary={
                    <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                      Total de Categorías
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h4" sx={{ color: "white", mt: 0.25 }}>
                      {cantidadCategorias}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
}
