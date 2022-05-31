import React, { useState } from "react";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
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
  IconButton,
  InputAdornment,
  FormHelperText,
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
  const { formik, visualizar } = props;
  const classes = styles();

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    values,
    setFieldValue,
  } = formik;

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  return (
    <div>
      <CardContent className={classes.cardContent}>
        <FormControl autoComplete="off" noValidate>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid container item xs={6}>
                  <FormControl fullWidth className={classes.pos}>
                    <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Rol"
                      required
                      {...getFieldProps("rol")}
                      disabled={visualizar}
                      error={Boolean(touched.rol && errors.rol)}
                    >
                      <MenuItem value={"admin"}>Administrador</MenuItem>
                      <MenuItem value={"harvester"}>Cosechador</MenuItem>
                      <MenuItem value={"planner"}>Planillero</MenuItem>
                    </Select>
                    {Boolean(touched.rol && errors.rol) && (
                      <FormHelperText style={{ color: "#d32f2f" }}>
                        {touched.rol && errors.rol}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid container item xs={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={es}
                  >
                    <DatePicker
                      label="Fecha Ingreso"
                      value={values.fechaCreacion}
                      onChange={(value) => {
                        setFieldValue("fechaCreacion", value);
                      }}
                      disabled={visualizar}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            className={classes.pos}
                            required
                            id="fechaCreacion"
                            fullWidth
                            error={Boolean(
                              touched.fechaCreacion && errors.fechaCreacion
                            )}
                            helperText={
                              touched.fechaCreacion && errors.fechaCreacion
                            }
                          />
                        );
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    margin="dense"
                    id="nombreUsuario"
                    fullWidth
                    disabled={visualizar}
                    label="Nombre"
                    {...getFieldProps("nombreUsuario")}
                    error={Boolean(
                      touched.nombreUsuario && errors.nombreUsuario
                    )}
                    helperText={touched.nombreUsuario && errors.nombreUsuario}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    margin="dense"
                    id="apellidoUsuario"
                    fullWidth
                    disabled={visualizar}
                    label="Apellidos"
                    {...getFieldProps("apellidoUsuario")}
                    error={Boolean(
                      touched.apellidoUsuario && errors.apellidoUsuario
                    )}
                    helperText={
                      touched.apellidoUsuario && errors.apellidoUsuario
                    }
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
                    disabled={visualizar}
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
                    disabled={visualizar}
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
                    disabled={visualizar}
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
                    disabled={visualizar}
                    {...getFieldProps("comuna")}
                    error={Boolean(touched.comuna && errors.comuna)}
                    helperText={touched.comuna && errors.comuna}
                  />
                </Grid>

                {values.rol !== "harvester" && values.rol !== "" && (
                  <>
                    <Grid container item xs={12}>
                      <Divider style={{ width: "100%" }} textAlign="center">
                        <Chip
                          label="Credenciales de Página Web Para el Nuevo Usuario"
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
                        margin="dense"
                        id="correo"
                        label="Correo"
                        autoComplete="new-email"
                        fullWidth
                        disabled={visualizar}
                        {...getFieldProps("correo")}
                        error={Boolean(touched.correo && errors.correo)}
                        helperText={touched.correo && errors.correo}
                      />
                    </Grid>
                    <Grid container item xs={6}>
                      {!visualizar && (
                        <TextField
                          className={classes.pos}
                          margin="dense"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          label="Contraseña"
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleShowPassword}
                                  edge="end"
                                >
                                  <Icon
                                    icon={showPassword ? eyeFill : eyeOffFill}
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          autoComplete="new-password"
                          {...getFieldProps("password")}
                          error={Boolean(touched.password && errors.password)}
                          helperText={touched.password && errors.password}
                        />
                      )}
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
