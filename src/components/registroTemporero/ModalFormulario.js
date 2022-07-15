import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ModalConfirmacion from "./ModalConfirmacion";
import { validateRut, formatRut, RutFormat } from "@fdograph/rut-utilities";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import FormularioEmpleado from "./FormularioEmpleado";

import { auth, db } from "../../api/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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

export default function ModalFormulario(props) {
  const {
    open,
    setOpen,
    setShowAlert,
    setMessage,
    setColor,
    usuario,
    visualizar,
    setOpenSeleccion,
  } = props;
  const [loading, setLoading] = useState(false);
  const [loadingCredenciales, setLoadingCredenciales] = useState(false);
  const [credenciales, setCredenciales] = useState(false);
  const { userData, login } = useAuth();
  const navigate = useNavigate();

  const FormSchema = Yup.object().shape({
    nombreUsuario: Yup.string().required("Nombre del trabajador requerido"),
    apellidoUsuario: Yup.string().required(
      "Apellidos del trabajador requerido"
    ),
    rut: Yup.string().test(
      "rut test",
      "Rut no válido",
      (value) => validateRut(value) || value === ""
    ),
    ciudad: Yup.string().required("Ciudad requerida"),
    comuna: Yup.string().required("Comuna requerida"),
    rol: Yup.string().required("Rol requerido"),
    direccion: Yup.string().required("dirección del trabajador requerida"),
    correo: Yup.string().email("Correo no válido"),
    password: Yup.string(),
    fechaCreacion: Yup.date().required("Fecha requerida").nullable(),
  });

  const formik = useFormik({
    initialValues: {
      nombreUsuario:
        usuario.nombreUsuario !== undefined ? usuario.nombreUsuario : "",
      apellidoUsuario:
        usuario.apellidoUsuario !== undefined ? usuario.apellidoUsuario : "",
      rut: usuario.rut !== undefined ? usuario.rut : "",
      direccion: usuario.direccion !== undefined ? usuario.direccion : "",
      ciudad: usuario.ciudad !== undefined ? usuario.ciudad : "",
      comuna: usuario.comuna !== undefined ? usuario.comuna : "",
      correo: usuario.correo !== undefined ? usuario.correo : "",
      rol: usuario.rol !== undefined ? usuario.rol : "",
      password: usuario.password !== undefined ? usuario.password : "",
      fechaCreacion:
        usuario.fechaCreacion !== undefined && usuario.fechaCreacion !== ""
          ? new Date(usuario.fechaCreacion.toDate())
          : "",
      habilitado: usuario.habilitado !== undefined ? usuario.habilitado : "",
    },
    validationSchema: FormSchema,
    onSubmit: () => guardarDatos(),
  });

  const FormSchemaCredentials = Yup.object().shape({
    correo: Yup.string()
      .email("Correo no válido")
      .required("Se debe ingresar el correo"),
    password: Yup.string().required("Se debe ingresar una contraseña"),
  });

  const formikCredentials = useFormik({
    initialValues: {
      correo: "",
      password: "",
    },
    validationSchema: FormSchemaCredentials,
    onSubmit: () => guardarDatosAdminPlanner(),
  });

  const { handleSubmit, values, setFieldError } = formik;

  const error = () => {
    setMessage("Ha ocurrido un error.");
    setColor("error");
    setOpen(false);
    setOpenSeleccion(false);
    setLoadingCredenciales(false);
    setShowAlert(true);
  };
  const guardarDatosAdminPlanner = async () => {
    setLoadingCredenciales(true);
    await createUserWithEmailAndPassword(auth, values.correo, values.password)
      .then(async (e) => {
        const id = e.user.uid;
        const data = {
          ...values,
          uid: id,
          cuid: userData.rol === "company" ? userData.uid : userData.cuid,
          rut: formatRut(values.rut, RutFormat.DOTS_DASH),
          habilitado: true,
        };
        delete data.password;
        await setDoc(doc(db, "usuarios", id), data)
          .then(() => {
            login(
              formikCredentials.values.correo,
              formikCredentials.values.password
            )
              .then(() => {
                setMessage("Se ha guardado correctamente en la base de datos");
                setColor("success");
                setLoadingCredenciales(false);
                setCredenciales(false);
                setOpen(false);
                setOpenSeleccion(false);
                setShowAlert(true);
                navigate("/dashboard/reportes", { replace: true });
              })
              .catch(() => {
                error();
              });
          })
          .catch(() => {
            error();
          });
      })
      .catch(() => {
        error();
      });
  };

  const guardarCosechador = async () => {
    const data = {
      ...values,
      uid: values.rut,
      cuid: userData.rol === "company" ? userData.uid : userData.cuid,
      rut: formatRut(values.rut, RutFormat.DOTS_DASH),
      habilitado: true,
    };
    delete data.password;
    delete data.correo;
    await setDoc(doc(db, "usuarios", data.rut), data)
      .then(() => {
        setMessage("Se ha guardado correctamente en la base de datos");
        setColor("success");
        setLoading(false);
        setOpen(false);
        setOpenSeleccion(false);
        setShowAlert(true);
      })
      .catch(() => {
        error();
      });
  };
  const guardarDatos = () => {
    if (!visualizar) {
      if (values.rol === "harvester") {
        setLoading(true);
        guardarCosechador();
      } else {
        if (values.correo === "")
          return setFieldError("correo", "Correo requerido");
        if (values.password === "")
          return setFieldError("password", "Contraseña requerida");
        setCredenciales(true);
      }
    } else {
      handleClose();
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
          Ingrese los datos del nuevo usuario
        </BootstrapDialogTitle>
        <FormikProvider value={formik}>
          <DialogContent dividers>
            <FormularioEmpleado formik={formik} visualizar={visualizar} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>

            <LoadingButton onClick={handleSubmit} loading={loading}>
              {visualizar ? "Confirmar" : "Guardar"}
            </LoadingButton>
          </DialogActions>
        </FormikProvider>
      </BootstrapDialog>
      {credenciales && (
        <ModalConfirmacion
          open={credenciales}
          setOpen={setCredenciales}
          formik={formikCredentials}
          loading={loadingCredenciales}
        />
      )}
    </div>
  );
}
