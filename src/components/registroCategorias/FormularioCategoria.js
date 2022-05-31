import React, { useState } from "react";

import { CardContent, FormControl, TextField, Grid, Box } from "@mui/material";
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

export default function FormularioCategoria(props) {
  const { formik } = props;
  const classes = styles();

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    values,
    setFieldValue,
  } = formik;

  return (
    <div>
      <CardContent className={classes.cardContent}>
        <FormControl autoComplete="off" noValidate>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    id="nombreCategoria"
                    fullWidth
                    label="Nombre"
                    {...getFieldProps("nombreCategoria")}
                    error={Boolean(
                      touched.nombreCategoria && errors.nombreCategoria
                    )}
                    helperText={
                      touched.nombreCategoria && errors.nombreCategoria
                    }
                  />
                </Grid>
                <Grid container item xs={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={es}
                  >
                    <DatePicker
                      label="Fecha Inicio"
                      value={values.fechaInicio}
                      onChange={(value) => {
                        setFieldValue("fechaInicio", value);
                      }}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            className={classes.pos}
                            required
                            id="fechaInicio"
                            fullWidth
                            error={Boolean(
                              touched.fechaInicio && errors.fechaInicio
                            )}
                            helperText={
                              touched.fechaInicio && errors.fechaInicio
                            }
                          />
                        );
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
          </Form>
        </FormControl>
      </CardContent>
    </div>
  );
}
