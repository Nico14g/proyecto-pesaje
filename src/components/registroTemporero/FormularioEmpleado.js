import React, { useState } from "react";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import {
  CardContent,
  FormControl,
  TextField,
  Grid,
  CardActions,
  Button,
  Box,
  InputLabel,
  MenuItem,
  Select,
  Divider,
  Chip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Form } from "formik";
import { db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";

const styles = makeStyles((theme) => ({
  pos: {
    width: "30vw",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function FormularioEmpleado(props) {
  const { formik } = props;
  const classes = styles();
  const [rol, setRol] = useState("");
  const { errors, touched, handleSubmit, getFieldProps } = formik;
  const [fecha, setFecha] = useState(null);

  const handleChange = (event) => {
    setRol(event.target.value);
  };
  return (
    <div>
      <CardContent className={classes.cardContent}>
        <FormControl autoComplete="off" noValidate>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid container item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={rol}
                      label="Rol"
                      onChange={handleChange}
                    >
                      <MenuItem value={"admin"}>Administrador</MenuItem>
                      <MenuItem value={"cosechador"}>Cosechador</MenuItem>
                      <MenuItem value={"planner"}>Planillero</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid container item xs={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={es}
                  >
                    <DatePicker
                      label="Fecha Ingreso"
                      value={fecha}
                      onChange={(newValue) => {
                        setFecha(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    autoFocus
                    margin="dense"
                    id="nombre"
                    fullWidth
                    label="Nombre"
                    {...getFieldProps("nombre")}
                    error={Boolean(touched.nombre && errors.nombre)}
                    helperText={touched.nombre && errors.nombre}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    margin="dense"
                    id="apellidos"
                    fullWidth
                    label="Apellidos"
                    {...getFieldProps("apellidos")}
                    error={Boolean(touched.apellidos && errors.apellidos)}
                    helperText={touched.apellidos && errors.apellidos}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    margin="dense"
                    id="rut"
                    label="Rut"
                    fullWidth
                    {...getFieldProps("rut")}
                    error={Boolean(touched.rut && errors.rut)}
                    helperText={touched.rut && errors.rut}
                  />
                </Grid>

                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    margin="dense"
                    id="direccion"
                    label="Dirección"
                    fullWidth
                    {...getFieldProps("direccion")}
                    error={Boolean(touched.direccion && errors.direccion)}
                    helperText={touched.direccion && errors.direccion}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    margin="dense"
                    id="ciudad"
                    label="Ciudad"
                    fullWidth
                    {...getFieldProps("ciudad")}
                    error={Boolean(touched.ciudad && errors.ciudad)}
                    helperText={touched.ciudad && errors.ciudad}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    margin="dense"
                    id="comuna"
                    label="Comuna"
                    fullWidth
                    {...getFieldProps("comuna")}
                    error={Boolean(touched.comuna && errors.comuna)}
                    helperText={touched.comuna && errors.comuna}
                  />
                </Grid>

                {rol !== "cosechador" && rol !== "null" && (
                  <>
                    <Grid container item xs={12}>
                      <Divider style={{ width: "85%" }} textAlign="left">
                        <Chip
                          label="Credenciales Página web"
                          icon={
                            <Icon
                              icon={eyeFill}
                              color="#4BC74F"
                              fontSize={24}
                            />
                          }
                        />
                      </Divider>
                    </Grid>
                    <Grid container item xs={6}>
                      <TextField
                        className={classes.pos}
                        required
                        margin="dense"
                        id="email"
                        label="Email"
                        fullWidth
                        {...getFieldProps("email")}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid container item xs={6}>
                      <TextField
                        className={classes.pos}
                        required
                        margin="dense"
                        id="password"
                        label="Contraseña"
                        fullWidth
                        {...getFieldProps("password")}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                      />
                    </Grid>
                  </>
                )}

                {/* <Box style={{ marginTop: 20 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ color: "white" }}
                  onClick={handleSubmit}
                >
                  Guardar
                </Button>
              </Box> */}
              </Grid>
            </Box>
          </Form>
        </FormControl>
      </CardContent>
      {/* <CardActions>
        <Button
          size="large"
          variant="contained"
          color="secondary"
          style={{ color: "white" }}
        >
          Guardar
        </Button>
      </CardActions> */}
    </div>
  );
}
