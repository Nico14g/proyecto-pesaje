import React from "react";
import {
  CardContent,
  FormControl,
  TextField,
  Grid,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Form, FormikProvider } from "formik";
import { db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";

const styles = makeStyles((theme) => ({
  pos: {
    marginBottom: 15,
    width: "50vw",
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

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <div>
      <CardContent className={classes.cardContent}>
        <FormControl autoComplete="off" noValidate>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container item xs={12} spacing={1}>
                  <TextField
                    className={classes.pos}
                    required
                    autoFocus
                    margin="dense"
                    id="nombre"
                    fullWidth
                    label="Nombre y Apellidos"
                    {...getFieldProps("nombre")}
                    error={Boolean(touched.nombre && errors.nombre)}
                    helperText={touched.nombre && errors.nombre}
                  />
                </Grid>
                <Grid container item xs={12} spacing={1}>
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

                <Grid container item xs={12} spacing={1}>
                  <TextField
                    className={classes.pos}
                    required
                    margin="dense"
                    id="fechaNacimiento"
                    label="fecha de Nacimiento"
                    fullWidth
                    {...getFieldProps("fechaNacimiento")}
                    error={Boolean(
                      touched.fechaNacimiento && errors.fechaNacimiento
                    )}
                    helperText={
                      touched.fechaNacimiento && errors.fechaNacimiento
                    }
                  />
                </Grid>
                <Grid container item xs={12} spacing={1}>
                  <TextField
                    className={classes.pos}
                    required
                    margin="dense"
                    id="profesionOficio"
                    label="Profesión u Oficio"
                    fullWidth
                    {...getFieldProps("profesionOficio")}
                    error={Boolean(
                      touched.profesionOficio && errors.profesionOficio
                    )}
                    helperText={
                      touched.profesionOficio && errors.profesionOficio
                    }
                  />
                </Grid>

                <Grid container item xs={12} spacing={1}>
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
              </Form>
              <Box style={{ marginTop: 20 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ color: "white" }}
                  onClick={handleSubmit}
                >
                  Guardar
                </Button>
              </Box>
            </FormikProvider>
          </Grid>
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
