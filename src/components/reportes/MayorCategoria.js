import { useTheme, styled } from "@mui/material/styles";
import { Box, Typography, Grid } from "@mui/material";
import MainCard from "../MainCard";
import SkeletonTotalPesaje from "./SkeletonTotalPesaje";
import ReactApexChart from "react-apexcharts";

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

export default function MayorCategoria(props) {
  const { isLoading, mayorCategoria, texto } = props;
  const theme = useTheme();

  const pieChart = {
    series: mayorCategoria.data,
    options: {
      chart: {
        width: "80%",

        type: "pie",
      },

      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
          },
          donut: {
            size: "70%",
            labels: {
              show: true,
              name: {
                show: true,
                color: "white",
                formatter: function (val, opts) {
                  return "Total";
                },
              },
              value: {
                show: true,
                color: "white",
              },
              total: {
                show: true,
                color: "white",
              },
            },
          },
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex] + " KG";
        },
      },
    },
  };

  return (
    <>
      {isLoading || mayorCategoria.length === 0 ? (
        <SkeletonTotalPesaje />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 1 }}>
            <Grid container>
              <Grid item xs={7}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "white", mt: 0.25 }}
                >
                  {texto}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                  {mayorCategoria.nombreCategoria.toUpperCase()}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                  Peso:{" "}
                  {mayorCategoria.data.reduce(
                    (partialSum, a) => partialSum + a,
                    0
                  )}{" "}
                  KG
                </Typography>
              </Grid>
              <Grid item xs={5}>
                {mayorCategoria.data.length > 0 ? (
                  <Box>
                    <ReactApexChart
                      options={pieChart.options}
                      series={pieChart.series}
                      type="donut"
                      width={150}
                    />
                  </Box>
                ) : (
                  <Box style={{ height: 104 }}></Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
}
