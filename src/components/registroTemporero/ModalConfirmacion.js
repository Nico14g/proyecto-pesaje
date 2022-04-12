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
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import FormularioConfirmacion from "./FormularioConfirmacion";
import { FormikProvider } from "formik";
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

export default function ModalConfirmacion(props) {
  const { open, setOpen, formik, loading } = props;

  const { userData } = useAuth();

  const { handleSubmit } = formik;

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog
        fullWidth={true}
        onClose={handleClose}
        disableEscapeKeyDown={true}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="dialog" onClose={handleClose}>
          Ingrese sus credenciales
        </BootstrapDialogTitle>
        <FormikProvider value={formik}>
          <DialogContent dividers>
            <Typography>
              {" "}
              Es necesario ingresar su correo y contraseña para confirmar la
              acción
            </Typography>
            <FormularioConfirmacion formik={formik} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>

            <LoadingButton onClick={handleSubmit} loading={loading}>
              Confirmar
            </LoadingButton>
          </DialogActions>
        </FormikProvider>
      </BootstrapDialog>
    </div>
  );
}
