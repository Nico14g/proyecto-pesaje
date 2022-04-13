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

import { db } from "../../api/firebase";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import useAuth from "../../Auth/Auth";
import FormularioBandeja from "./FormularioBandejas";

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

export default function ModalBandeja(props) {
  const {
    open,
    setOpen,
    setShowAlert,
    setMessage,
    setColor,
    bandeja,
    visualizar,
    editar,
  } = props;
  const [loading, setLoading] = useState(false);

  const { userData } = useAuth();

  const FormSchema = Yup.object().shape({
    nombre: Yup.string().required("Nombre requerido"),

    dcto: Yup.number()
      .min(0.0001, "Debe ser mayor a 0")
      .required("Peso Tara requerido"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: bandeja.nombre,
      dcto: bandeja.dcto,
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
    if (!visualizar) {
      setLoading(true);
      if (!editar) {
        const data = {
          ...values,
          cuid: userData.rol === "company" ? userData.uid : userData.cuid,
          id: values.nombre,
        };
        await addDoc(collection(db, "bandeja"), data)
          .then(async (e) => {
            const info = { ...data, id: e.id };
            await setDoc(doc(db, "bandeja", e.id), info)
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
      } else {
        const data = {
          ...values,
          cuid: userData.rol === "company" ? userData.uid : userData.cuid,
          id: bandeja.id,
        };
        await setDoc(doc(db, "bandeja", bandeja.id), data)
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
      }
    } else {
      setOpen(false);
    }
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
          Ingrese los Datos de la Bandeja
        </BootstrapDialogTitle>
        <FormikProvider value={formik}>
          <DialogContent dividers>
            <FormularioBandeja formik={formik} visualizar={visualizar} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>

            <LoadingButton onClick={handleSubmit} loading={loading}>
              {visualizar ? "Confirmar" : "Guardar"}
            </LoadingButton>
          </DialogActions>
        </FormikProvider>
      </BootstrapDialog>
    </div>
  );
}
