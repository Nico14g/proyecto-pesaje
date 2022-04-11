import * as React from "react";
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
import { validateRut } from "@fdograph/rut-utilities";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import FormularioEmpleado from "./FormularioEmpleado";

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
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
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

export default function ModalFormulario(props) {
  const { open, setOpen } = props;
  const FormSchema = Yup.object().shape({
    nombre: Yup.string().required("Nombre del trabajador requerido"),
    apellidos: Yup.string().required("Apellidos del trabajador requerido"),
    rut: Yup.string().test(
      "rut test",
      "Rut no válido",
      (value) => validateRut(value) || value === ""
    ),
    ciudad: Yup.string().required("Ciudad requerida"),
    comuna: Yup.string().required("Comuna requerida"),

    direccion: Yup.string().required("dirección del trabajador requerida"),
    email: Yup.string().email("Correo no válido").required("Correo requerido"),
    password: Yup.string().required("Contraseña requerida"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellidos: "",
      rut: "",
      direccion: "",
      ciudad: "",
      comuna: "",
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: FormSchema,
    onSubmit: () => {
      console.log("hola");
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const { handleSubmit } = formik;
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
          Ingrese los datos del nuevo usuario
        </BootstrapDialogTitle>
        <FormikProvider value={formik}>
          <DialogContent dividers>
            <FormularioEmpleado formik={formik} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleSubmit}>
              Guardar
            </Button>
          </DialogActions>
        </FormikProvider>
      </BootstrapDialog>
    </div>
  );
}
