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
import TablaHistorial from "../components/reportes/TablaHistorial";
import ExportToExcel from "../utilidades/ExportToExcel";
import { Alerta } from "../components/Alert";

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
  const [registrosTemporero, setRegistrosTemporero] = useState([]);
  const [cantidadCategorias, setCantidadCategorias] = useState([]);
  const [mayorCategoria, setMayorCategoria] = useState([]);
  const [menorCategoria, setMenorCategoria] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedTemporero, setSelectedTemporero] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMayor, setIsLoadingMayor] = useState(true);
  const [pastelChart, setPastelChart] = useState({ serie: [], labels: [""] });
  const [lineaChart, setLineaChart] = useState({ serie: [], labels: [""] });
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");

  const [lineaChartTemp, setLineaChartTemp] = useState({
    serie: [],
    labels: [""],
  });
  const [lineaChartMejorTemp, setLineaChartMejorTemp] = useState({
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
  const [cambioCategoria, setCambioCategoria] = useState(true);

  const obtenerCategoria = (categories, tipo) => {
    let registros = [];

    categories.map((categoria) =>
      registros.push(
        categoria.registros.reduce(
          (partialSum, a) => partialSum + a.acumulado,
          0
        )
      )
    );
    let i;
    if (tipo === "max") {
      i = registros.indexOf(Math.max(...registros));
    } else {
      i = registros.indexOf(Math.min(...registros));
    }

    const categoria = {
      ...categories[i],
      data: categories[i].registros.map((register) =>
        roundToTwo(register.acumulado)
      ),
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
    const q = query(collection(db, "categoria"), where("cuid", "==", cuid));
    let categorias = [];
    let registros = [];
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let registers = [];

        onSnapshot(collection(doc.ref, "registros"), (querySnapshot2) => {
          querySnapshot2.forEach((doc2) => {
            let registrosTemporero = [];

            onSnapshot(
              collection(doc2.ref, "registrosTemporero"),
              (querySnapshot3) => {
                querySnapshot3.forEach((doc3) => {
                  registrosTemporero.push(doc3.data());
                });
                registers.push({
                  ...doc2.data(),
                  registrosTemporero: registrosTemporero,
                });
                setRegistrosTemporero((a) => [...a, registrosTemporero]);
              }
            );
          });
        });
        categorias.push({ ...doc.data(), registros: registers });
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
  }, [userData.uid, userData.cuid, userData.rol, userData.rut]);

  useEffect(() => {
    if (categorias.length > 0 && registros.length > 0) {
      obtenerCategoria(categorias, "max");
      obtenerCategoria(categorias, "min");
    } else {
      setSelectedCategoria({
        nombreCategoria: "",
        registros: [],
      });

      setMayorCategoria({ nombreCategoria: "No hay categorías", data: [0] });
      setMenorCategoria({ nombreCategoria: "No hay categorías", data: [0] });
      setIsLoadingMayor(false);
    }
  }, [categorias, registros, registrosTemporero]);

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
      data.serie = selectedCategoria.registros.map((register) =>
        roundToTwo(register.acumulado)
      );

      data.labels = selectedCategoria.registros.map(
        (register) =>
          register.nombreTemporero +
          " " +
          register.apellidoTemporero +
          "-" +
          register.idRegistro
      );
      setPastelChart(data);
    };

    const graficoLineal = () => {
      let totalRegisters = [];

      let workerRegister = selectedCategoria.registros.map((registro) =>
        registro.registrosTemporero.map((wr) => wr)
      );
      workerRegister.map((workerRegister) =>
        workerRegister.map((register) => totalRegisters.push(register))
      );

      let dateRange = getDatesInRange(
        filterDate[0].startDate,
        filterDate[0].endDate
      );
      let serie = [];
      let range;
      let data;
      if (totalRegisters.length > 0) {
        dateRange.map((date, index) => {
          serie.push(0);
          for (let i = 0; i < totalRegisters.length; i++) {
            const element = totalRegisters[i];
            if (
              element.fecha.toDate().getFullYear() === date.getFullYear() &&
              element.fecha.toDate().getMonth() === date.getMonth() &&
              element.fecha.toDate().getDate() === date.getDate()
            ) {
              serie[index] = roundToTwo(
                serie[index] + parseFloat(element.peso)
              );
              totalRegisters.splice(i, 1);
              i--;
            }
          }
          return null;
        });
        range = dateRange.map((date) => date.getDate());
        data = { serie: serie, labels: range };
      } else {
        range = dateRange.map((date) => date.getDate());
        data = { serie: [0], labels: range };
      }

      setLineaChart(data);
    };

    const generarSerieLineal = (workerRegister) => {
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
            element.fecha.toDate().getFullYear() === date.getFullYear() &&
            element.fecha.toDate().getMonth() === date.getMonth() &&
            element.fecha.toDate().getDate() === date.getDate()
          ) {
            serie[index] = roundToTwo(serie[index] + parseFloat(element.peso));
            workerRegister.splice(i, 1);
            i--;
          }
        }
        return null;
      });
      let range = dateRange.map((date) => date.getDate());
      return { serie: serie, labels: range };
    };

    const graficoLinealMejorTemporero = () => {
      let workerRegisters = [];
      let pesos = [];
      //console.log(selectedCategoria, "asd");
      selectedCategoria.registros.map((registro) => {
        let sumaPeso = 0;
        workerRegisters.push({
          workerRegister: registro.registrosTemporero.map((wr) => wr),
        });
        registro.registrosTemporero.map(
          (wr) => (sumaPeso = sumaPeso + wr.peso)
        );
        pesos.push(sumaPeso);
        return null;
      });
      let wr = workerRegisters[pesos.indexOf(Math.max(...pesos))];
      //console.log(wr.workerRegister);
      let data = generarSerieLineal(wr.workerRegister);
      setLineaChartMejorTemp(data);
    };
    const graficoLinealTemporero = () => {
      let workerRegister = [];
      if (selectedTemporero !== null) {
        workerRegister = selectedTemporero.registrosTemporero.map((wr) => wr);
      } else {
        workerRegister = selectedCategoria.registros[0].registrosTemporero.map(
          (wr) => wr
        );
      }

      let data = generarSerieLineal(workerRegister);
      setLineaChartTemp(data);
    };

    if (selectedCategoria !== null) {
      graficoPastel();
      graficoLineal();
      if (selectedCategoria.registros.length > 0) {
        if (cambioCategoria) {
          setSelectedTemporero(selectedCategoria.registros[0]);
        }
        graficoLinealMejorTemporero();
        graficoLinealTemporero();
      }
    }
  }, [
    selectedCategoria,
    selectedTemporero,
    registros,
    registrosTemporero,
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
          show: true,

          tools: {
            download: true,
            zoom: false,
            zoomin: true,
            zoomout: true,
            selection: true,
            pan: false,
            reset: false,
          },
          export: {
            csv: {
              filename: "Cosecha_Por_Día",
              columnDelimiter: ",",
              headerCategory: "Día",
              headerValue: "value",
              dateFormatter(timestamp) {
                return new Date(timestamp).toDateString();
              },
            },
            svg: {
              filename: "Cosecha_Por_Día",
            },
            png: {
              filename: "Cosecha_Por_Día",
            },
          },
          autoSelected: "zoom",
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
        name: "Temporero seleccionado",
        data: lineaChartTemp.serie,
      },
      {
        name: "Mejor temporero",
        data: lineaChartMejorTemp.serie,
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
          show: true,

          tools: {
            download: true,
            zoom: false,
            zoomin: true,
            zoomout: true,
            selection: true,
            pan: false,
            reset: false,
          },
          export: {
            csv: {
              filename: "Desempeño_Temporero",
              columnDelimiter: ",",
              headerCategory: "Día",
              headerValue: "value",
              dateFormatter(timestamp) {
                return new Date(timestamp).toDateString();
              },
            },
            svg: {
              filename: "Desempeño_Temporero",
            },
            png: {
              filename: "Desempeño_Temporero",
            },
          },
          autoSelected: "zoom",
        },
      },
      colors: ["#19A84C", "#26A0FC"],
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
        max:
          Math.max(...lineaChartMejorTemp.serie) >
          Math.max(...lineaChartTemp.serie)
            ? Math.max(...lineaChartMejorTemp.serie) + 3
            : Math.max(...lineaChartTemp.serie) + 3,
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

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  return (
    <Page title="Gestión Cosecha">
      <Container>
        <Card className={classes.root}>
          <Typography variant="h5" component="h2" className={classes.title}>
            Visualización de datos
          </Typography>
          <Grid container spacing={2} style={{ marginLeft: 30 }}>
            <Grid item xs={12} md={3}>
              <TotalCategoriasCard
                isLoading={isLoading}
                cantidadCategorias={cantidadCategorias}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MayorCategoria
                isLoading={isLoadingMayor}
                mayorCategoria={mayorCategoria}
                texto="Mayor Registro"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MayorCategoria
                isLoading={isLoadingMayor}
                mayorCategoria={menorCategoria}
                texto="Menor Registro"
              />
            </Grid>
          </Grid>
          {!isLoading && selectedCategoria && pastelChart && (
            <>
              <Container
                style={{
                  marginTop: 30,
                  marginBottom: 15,
                  marginLeft: 20,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      id="controlled-demo"
                      options={categorias}
                      value={selectedCategoria}
                      isOptionEqualToValue={(option, value) =>
                        option.idCategoria === value.idCategoria
                      }
                      getOptionLabel={(option) => option.nombreCategoria}
                      onChange={(event, newValue) => {
                        if (newValue !== null) {
                          setCambioCategoria(true);
                          setSelectedCategoria(newValue);

                          if (newValue.registros.length > 0) {
                            setSelectedTemporero(newValue.registros[0]);
                          } else {
                            setSelectedTemporero({
                              nombreTemporero: "",
                              apellidoTemporero: "",
                              idRegistro: "",
                              registrosTemporero: [],
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
                  {categorias.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <ExportToExcel
                        data={categorias.find(
                          (categoria) =>
                            categoria.idCategoria ===
                            selectedCategoria.idCategoria
                        )}
                        filename={
                          "Cosecha " +
                          categorias.find(
                            (categoria) =>
                              categoria.idCategoria ===
                              selectedCategoria.idCategoria
                          )?.nombreCategoria
                        }
                        sheetName={
                          "Cosecha " +
                          categorias.find(
                            (categoria) =>
                              categoria.idCategoria ===
                              selectedCategoria.idCategoria
                          )?.nombreCategoria
                        }
                        setShowAlert={setShowAlert}
                        setColor={setColor}
                        setMessage={setMessage}
                      />
                    </Grid>
                  )}
                </Grid>
              </Container>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
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
                            No se han encontrado registros
                          </Typography>
                        </Card>
                      </Box>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={12} md={7}>
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
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    id="controlled-demo"
                    options={selectedCategoria.registros}
                    value={selectedTemporero}
                    isOptionEqualToValue={(option, value) =>
                      option.idRegistro === value.idRegistro
                    }
                    getOptionLabel={(option) =>
                      option.nombreTemporero + " " + option.apellidoTemporero
                    }
                    style={{ marginTop: 30, marginBottom: 30 }}
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                        setCambioCategoria(false);
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
                <Grid item xs={12} md={6}></Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginBottom: 60 }}>
                <Grid item xs={12} md={5}>
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
                      {selectedTemporero !== null ? (
                        <TablaHistorial
                          id={selectedTemporero.idRegistro}
                          registros={selectedTemporero.registrosTemporero.sort(
                            (a, b) => b.fecha.toDate() - a.fecha.toDate()
                          )}
                        />
                      ) : (
                        <TablaHistorial id={0} registros={[]} />
                      )}
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={7}>
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
      {showAlert && (
        <Alerta
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          color={color}
          message={message}
        />
      )}
    </Page>
  );
}
