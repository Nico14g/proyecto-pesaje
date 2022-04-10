import React, { useState, useEffect } from "react";
import { Card, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useStore from "../store/store";

import { validateRut } from "@fdograph/rut-utilities";
import * as Yup from "yup";
import { useFormik } from "formik";
import FormularioEmpleado from "../components/registroTemporero/FormularioEmpleado";

const styles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
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

export default function Registro() {
  const open = useStore((state) => state.open);
  const classes = styles(open);

  const FormSchema = Yup.object().shape({
    nombre: Yup.string().required(
      "Nombre y apellidos del trabajador requerido"
    ),
    rut: Yup.string().test(
      "rut test",
      "Rut no válido",
      (value) => validateRut(value) || value === ""
    ),
    numeroDocumento: Yup.string().required("Número de documento requerido"),
    nacionalidad: Yup.string().required("Nacionalidad requerida"),
    fechaNacimiento: Yup.string().required("Fecha de nacimiento requerida"),
    profesionOficio: Yup.string().required(
      "Profesión u oficio del trabajador requerido"
    ),
    estadoCivil: Yup.string().required("Estado civil  requerido"),
    direccion: Yup.string().required("dirección del trabajador requerida"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      rut: "",
      fechaNacimiento: "",
      profesionOficio: "",
      direccion: "",
      remember: true,
    },
    validationSchema: FormSchema,
    onSubmit: () => {
      console.log("hola");
    },
  });

  return (
    <div className={classes.div}>
      <Card className={classes.root} variant="outlined">
        <Typography variant="h5" component="h2" className={classes.title}>
          Datos del Temporero
        </Typography>
        <FormularioEmpleado formik={formik} />
      </Card>
    </div>
  );
}
