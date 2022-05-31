import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import FormularioCategoria from "./FormularioCategoria";
import { db } from "../../api/firebase";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import useAuth from "../../Auth/Auth";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        backgroundColor: (theme) => theme.palette.primary.main,
        color: "white",
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ModalCategoria(props) {
  const { open, setOpen, setShowAlert, setMessage, setColor } = props;
  const [loading, setLoading] = useState(false);

  const { userData } = useAuth();

  const FormSchema = Yup.object().shape({
    nombreCategoria: Yup.string().required("Nombre requerido"),

    fechaInicio: Yup.date().required("Fecha requerida").nullable(),
  });

  const formik = useFormik({
    initialValues: {
      nombreCategoria: "",
      fechaInicio: new Date(),
    },
    validationSchema: FormSchema,
    onSubmit: () => guardarDatos(),
  });

  const { handleSubmit, values } = formik;

  const error = () => {
    setMessage("Ha ocurrido un error.");
    setColor("error");
    setOpen(false);
    setShowAlert(true);
  };

  const guardarDatos = async () => {
    setLoading(true);
    const data = {
      ...values,
      fechaTermino: "",
      cuid: userData.rol === "company" ? userData.uid : userData.cuid,
      idCategoria: values.nombreCategoria,
    };
    await addDoc(collection(db, "categoria"), data)
      .then(async (e) => {
        const info = { ...data, idCategoria: e.id };
        await setDoc(doc(db, "categoria", e.id), info)
          .then(() => {
            setMessage("Se ha guardado correctamente en la base de datos");
            setColor("success");
            setLoading(false);
            setOpen(false);
            setShowAlert(true);
          })
          .catch(() => {
            error();
          });
      })
      .catch(() => {
        error();
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Ingrese los Datos de la Nueva Categoría
        </BootstrapDialogTitle>
        <FormikProvider value={formik}>
          <DialogContent dividers>
            <FormularioCategoria formik={formik} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>

            <LoadingButton onClick={handleSubmit} loading={loading}>
              Guardar
            </LoadingButton>
          </DialogActions>
        </FormikProvider>
      </BootstrapDialog>
    </div>
  );
}
