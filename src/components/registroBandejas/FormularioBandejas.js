import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  CardContent,
  FormControl,
  TextField,
  Grid,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Form } from "formik";
import { db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";

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

export default function FormularioBandeja(props) {
  const { formik, visualizar } = props;
  const classes = styles();

  const { errors, touched, handleSubmit, getFieldProps } = formik;

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
                    id="nombre"
                    fullWidth
                    label="Nombre"
                    disabled={visualizar}
                    {...getFieldProps("nombre")}
                    error={Boolean(touched.nombre && errors.nombre)}
                    helperText={touched.nombre && errors.nombre}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    required
                    id="dcto"
                    type="number"
                    fullWidth
                    disabled={visualizar}
                    label="Peso Tara"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">KG</InputAdornment>
                      ),
                    }}
                    {...getFieldProps("dcto")}
                    error={Boolean(touched.dcto && errors.dcto)}
                    helperText={touched.dcto && errors.dcto}
                  />
                </Grid>
              </Grid>
            </Box>
          </Form>
        </FormControl>
      </CardContent>
    </div>
  );
}
