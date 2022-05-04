import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Typography,
  Container,
  Grid,
  Autocomplete,
  TextField,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Page from "../components/Page";
import { makeStyles } from "@mui/styles";
import useStore from "../store/store";
import ReactApexChart from "react-apexcharts";
import { db } from "../api/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import { es } from "date-fns/locale";
import useAuth from "../Auth/Auth";

import TotalCategoriasCard from "../components/reportes/TotalCategoriasCard";
import MayorCategoria from "../components/reportes/MayorCategoria";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import TablaHistorial from "../components/reportes/TablaHistorial";

const styles = makeStyles((theme) => ({
  root: {
    minWidth: 500,
    backgroundColor: "#EFFCFF",
    borderWidth: 0,
  },
  div: {
    marginLeft: "5%",
    width: "70vw",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: 20,
    marginTop: 20,
  },
}));

export default function Dashboard() {
  const open = useStore((state) => state.open);
  const [categorias, setCategorias] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [workerRegisters, setWorkerRegisters] = useState([]);
  const [cantidadCategorias, setCantidadCategorias] = useState([]);
  const [mayorCategoria, setMayorCategoria] = useState([]);
  const [menorCategoria, setMenorCategoria] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedTemporero, setSelectedTemporero] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMayor, setIsLoadingMayor] = useState(true);
  const [pastelChart, setPastelChart] = useState({ serie: [], labels: [""] });
  const [lineaChart, setLineaChart] = useState({ serie: [], labels: [""] });
  const [lineaChartTemp, setLineaChartTemp] = useState({
    serie: [],
    labels: [""],
  });
  const newDate = new Date();
  const [filterDate, setFilterDate] = useState([
    {
      startDate: new Date(newDate.getFullYear(), newDate.getMonth()),
      endDate: new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0),
      key: "selection",
    },
  ]);
  const [filterDateTemp, setFilterDateTemp] = useState([
    {
      startDate: new Date(newDate.getFullYear(), newDate.getMonth()),
      endDate: new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0),
      key: "selection",
    },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCalendarTemp, setShowCalendarTemp] = useState(false);
  const { userData } = useAuth();
  const classes = styles(open);
  const isMounted = useRef(true);

  const obtenerCategoria = (categories, tipo) => {
    let registers = [];

    categories.map((category) =>
      registers.push(
        category.registers.reduce(
          (partialSum, a) => partialSum + a.acumulate,
          0
        )
      )
    );
    let i;
    if (tipo === "max") {
      i = registers.indexOf(Math.max(...registers));
    } else {
      i = registers.indexOf(Math.min(...registers));
    }

    const categoria = {
      ...categories[i],
      data: categories[i].registers.map((register) => register.acumulate),
    };
    setIsLoadingMayor(false);
    if (tipo === "max") {
      setMayorCategoria(categoria);
    } else {
      setMenorCategoria(categoria);
    }
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const cuid = userData.rol === "company" ? userData.uid : userData.cuid;
    const q = query(collection(db, "category"), where("cuid", "==", cuid));
    let categorias = [];
    let registros = [];
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let registers = [];

        onSnapshot(collection(doc.ref, "registers"), (querySnapshot2) => {
          querySnapshot2.forEach((doc2) => {
            let workerRegisters = [];

            onSnapshot(
              collection(doc2.ref, "workerRegisters"),
              (querySnapshot3) => {
                querySnapshot3.forEach((doc3) => {
                  workerRegisters.push(doc3.data());
                });
                registers.push({
                  ...doc2.data(),
                  workerRegisters: workerRegisters,
                });
                setWorkerRegisters((a) => [...a, workerRegisters]);
              }
            );
          });
        });
        categorias.push({ ...doc.data(), registers: registers });
        registros.push(registers);
      });

      if (isMounted.current) {
        setIsLoading(false);
        setRegistros(registros);
        setCantidadCategorias(categorias.length);
        setCategorias(categorias);
        if (categorias.length > 0) {
          setSelectedCategoria(categorias[0]);
        }
      }
    });
  }, [userData.uid, userData.cuid, userData.rol, userData.run]);

  useEffect(() => {
    if (categorias.length > 0 && registros.length > 0) {
      obtenerCategoria(categorias, "max");
      obtenerCategoria(categorias, "min");
    }
  }, [categorias, registros, workerRegisters]);

  useEffect(() => {
    function getDatesInRange(startDate, endDate) {
      const date = new Date(startDate.getTime());

      const dates = [];

      while (date <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }

      return dates;
    }

    const graficoPastel = () => {
      let data = { serie: [], labels: [] };
      data.serie = selectedCategoria.registers.map(
        (register) => register.acumulate
      );

      data.labels = selectedCategoria.registers.map(
        (register) =>
          register.firstName + " " + register.lastName + "-" + register.id
      );
      setPastelChart(data);
    };

    const graficoLineal = () => {
      let totalRegisters = [];

      let workerRegister = selectedCategoria.registers.map((registro) =>
        registro.workerRegisters.map((wr) => wr)
      );
      workerRegister.map((workerRegister) =>
        workerRegister.map((register) => totalRegisters.push(register))
      );

      let dateRange = getDatesInRange(
        filterDate[0].startDate,
        filterDate[0].endDate
      );

      let serie = [];
      dateRange.map((date, index) => {
        serie.push(0);
        for (let i = 0; i < totalRegisters.length; i++) {
          const element = totalRegisters[i];
          if (
            element.date.toDate().getFullYear() === date.getFullYear() &&
            element.date.toDate().getMonth() === date.getMonth() &&
            element.date.toDate().getDate() === date.getDate()
          ) {
            serie[index] = serie[index] + parseFloat(element.weight);
            totalRegisters.splice(i, 1);
            i--;
          }
        }
        return null;
      });
      let range = dateRange.map((date) => date.getDate());
      let data = { serie: serie, labels: range };
      setLineaChart(data);
    };

    const graficoLinealTemporero = () => {
      let workerRegister = [];
      if (selectedTemporero !== null) {
        workerRegister = selectedTemporero.workerRegisters.map((wr) => wr);
      } else {
        workerRegister = selectedCategoria.registers[0].workerRegisters.map(
          (wr) => wr
        );
      }

      let dateRange = getDatesInRange(
        filterDateTemp[0].startDate,
        filterDateTemp[0].endDate
      );

      let serie = [];
      dateRange.map((date, index) => {
        serie.push(0);
        for (let i = 0; i < workerRegister.length; i++) {
          const element = workerRegister[i];
          if (
            element.date.toDate().getFullYear() === date.getFullYear() &&
            element.date.toDate().getMonth() === date.getMonth() &&
            element.date.toDate().getDate() === date.getDate()
          ) {
            serie[index] = serie[index] + parseFloat(element.weight);
            workerRegister.splice(i, 1);
            i--;
          }
        }
        return null;
      });
      let range = dateRange.map((date) => date.getDate());
      let data = { serie: serie, labels: range };
      setLineaChartTemp(data);
    };

    if (selectedCategoria !== null) {
      graficoPastel();
      graficoLineal();
      if (selectedCategoria.registers.length > 0) {
        setSelectedTemporero(selectedCategoria.registers[0]);
        graficoLinealTemporero();
      }
    }
  }, [
    selectedCategoria,
    selectedTemporero,
    registros,
    workerRegisters,
    filterDate,
    filterDateTemp,
  ]);

  const lineChart = {
    series: [
      {
        name: "Cosecha",
        data: lineaChart.serie,
      },
    ],
    options: {
      chart: {
        height: 120,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#19A84C"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: undefined,
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: lineaChart.labels,
        title: {
          text: "Días",
        },
      },
      yaxis: {
        title: {
          text: "Cantidad (KG)",
        },
        min: 0,
        max: Math.max(...lineaChart.serie) + 3,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: false,
        offsetY: -25,
        offsetX: -5,
      },
    },
  };

  const lineChartTemp = {
    series: [
      {
        name: "Cosecha",
        data: lineaChartTemp.serie,
      },
    ],
    options: {
      chart: {
        height: 120,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#19A84C"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: undefined,
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: lineaChartTemp.labels,
        title: {
          text: "Días",
        },
      },
      yaxis: {
        title: {
          text: "Cantidad (KG)",
        },
        min: 0,
        max: Math.max(...lineaChartTemp.serie) + 3,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: false,
        offsetY: -25,
        offsetX: -5,
      },
    },
  };

  const pieChart = {
    series: pastelChart.serie,

    options: {
      chart: {
        width: 600,
        height: 600,
        type: "pie",
      },
      labels: pastelChart.labels,
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
          },
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex] + " KG";
        },
      },
    },
  };
  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  }

  return (
    <Page title="Gestión Cosecha">
      <Container>
        <Card className={classes.root}>
          <Typography variant="h5" component="h2" className={classes.title}>
            Visualización de datos
          </Typography>
          <Grid container spacing={2} style={{ marginLeft: 30 }}>
            <Grid item xs={3}>
              <TotalCategoriasCard
                isLoading={isLoading}
                cantidadCategorias={cantidadCategorias}
              />
            </Grid>
            <Grid item xs={4}>
              <MayorCategoria
                isLoading={isLoadingMayor}
                mayorCategoria={mayorCategoria}
                texto="Mayor Registro"
              />
            </Grid>
            <Grid item xs={4}>
              <MayorCategoria
                isLoading={isLoadingMayor}
                mayorCategoria={menorCategoria}
                texto="Menor Registro"
              />
            </Grid>
          </Grid>
          {!isLoading && selectedCategoria && pastelChart && (
            <>
              <Grid container spacing={2} style={{ marginLeft: 30 }}>
                <Grid item xs={3}>
                  <Autocomplete
                    id="controlled-demo"
                    options={categorias}
                    value={selectedCategoria}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option) => option.name}
                    style={{ marginTop: 30, marginBottom: 30 }}
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                        setSelectedCategoria(newValue);
                        if (newValue.registers.length > 0) {
                          setSelectedTemporero(newValue.registers[0]);
                        } else {
                          setSelectedTemporero({
                            firstName: "",
                            lastName: "",
                            id: "",
                            workerRegisters: [],
                          });
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categoría"
                        variant="standard"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}></Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <Card>
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">Cosecha Acumulada</Typography>
                    </Box>
                    {pastelChart.serie.length > 0 ? (
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        <ReactApexChart
                          options={pieChart.options}
                          series={pieChart.series}
                          type="pie"
                          width={452}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Card
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 395,
                          }}
                        >
                          <Typography>
                            No se Han Encontrado Registros
                          </Typography>
                        </Card>
                      </Box>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={7}>
                  <Card>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      locale={es}
                    >
                      <Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h6">Cosecha por Día</Typography>
                        </Box>
                        <Grid container style={{ marginTop: 10 }}>
                          <Grid item xs={4} style={{ marginLeft: 60 }}>
                            <TextField
                              style={{ maxWidth: 180, height: 30 }}
                              InputLabelProps={{
                                style: {
                                  height: 30,
                                },
                              }}
                              inputProps={{
                                style: {
                                  height: 30,
                                  padding: "0 10px",
                                },
                              }}
                              value={formatDate(filterDate[0].startDate)}
                              onClick={() => setShowCalendar(!showCalendar)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton>
                                      <CalendarMonthIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Box style={{ alignSelf: "center" }}> hasta </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              style={{ maxWidth: 180, height: 30 }}
                              InputLabelProps={{
                                style: {
                                  height: 30,
                                },
                              }}
                              inputProps={{
                                style: {
                                  height: 30,
                                  padding: "0 10px",
                                },
                              }}
                              value={formatDate(filterDate[0].endDate)}
                              onClick={() => setShowCalendar(!showCalendar)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton>
                                      <CalendarMonthIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            {showCalendar && (
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <DateRange
                                  locale={es}
                                  showDateDisplay={false}
                                  dragSelectionEnabled={false}
                                  dateDisplayFormat="d MMMM yyyy"
                                  editableDateInputs={false}
                                  showSelectionPreview={false}
                                  onChange={(item) => {
                                    setFilterDate([item.selection]);
                                  }}
                                  moveRangeOnFirstSelection={false}
                                  ranges={filterDate}
                                />
                              </Box>
                            )}
                            {!showCalendar && (
                              <ReactApexChart
                                options={lineChart.options}
                                series={lineChart.series}
                                type="line"
                                height={340}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </LocalizationProvider>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginLeft: 30 }}>
                <Grid item xs={3}>
                  <Autocomplete
                    id="controlled-demo"
                    options={selectedCategoria.registers}
                    value={selectedTemporero}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option) =>
                      option.firstName + " " + option.lastName
                    }
                    style={{ marginTop: 30, marginBottom: 30 }}
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                        setSelectedTemporero(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Temporero"
                        variant="standard"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}></Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginBottom: 60 }}>
                <Grid item xs={5}>
                  <Card>
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        Historial de Registros
                      </Typography>
                    </Box>
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    >
                      {selectedTemporero !== null && (
                        <TablaHistorial
                          id={selectedTemporero.id}
                          registros={selectedTemporero.workerRegisters.sort(
                            (a, b) => b.date.toDate() - a.date.toDate()
                          )}
                        />
                      )}
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={7}>
                  <Card>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      locale={es}
                    >
                      <Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h6">
                            Desempeño por Día
                          </Typography>
                        </Box>
                        <Grid container style={{ marginTop: 10 }}>
                          <Grid item xs={4} style={{ marginLeft: 60 }}>
                            <TextField
                              style={{ maxWidth: 180, height: 30 }}
                              InputLabelProps={{
                                style: {
                                  height: 30,
                                },
                              }}
                              inputProps={{
                                style: {
                                  height: 30,
                                  padding: "0 10px",
                                },
                              }}
                              value={formatDate(filterDateTemp[0].startDate)}
                              onClick={() =>
                                setShowCalendarTemp(!showCalendarTemp)
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton>
                                      <CalendarMonthIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Box style={{ alignSelf: "center" }}> hasta </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              style={{ maxWidth: 180, height: 30 }}
                              InputLabelProps={{
                                style: {
                                  height: 30,
                                },
                              }}
                              inputProps={{
                                style: {
                                  height: 30,
                                  padding: "0 10px",
                                },
                              }}
                              value={formatDate(filterDateTemp[0].endDate)}
                              onClick={() =>
                                setShowCalendarTemp(!showCalendarTemp)
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton>
                                      <CalendarMonthIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            {showCalendarTemp && (
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <DateRange
                                  locale={es}
                                  showDateDisplay={false}
                                  dragSelectionEnabled={false}
                                  dateDisplayFormat="d MMMM yyyy"
                                  editableDateInputs={false}
                                  showSelectionPreview={false}
                                  onChange={(item) => {
                                    setFilterDateTemp([item.selection]);
                                  }}
                                  moveRangeOnFirstSelection={false}
                                  ranges={filterDateTemp}
                                />
                              </Box>
                            )}
                            {!showCalendarTemp && (
                              <ReactApexChart
                                options={lineChartTemp.options}
                                series={lineChartTemp.series}
                                type="line"
                                height={340}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </LocalizationProvider>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Card>
      </Container>
    </Page>
  );
}
