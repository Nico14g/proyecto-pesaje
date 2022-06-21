import React, { useState } from "react";
import { Icon } from "@iconify/react";
import saveFill from "@iconify/icons-eva/save-outline";
import {
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { db } from "../../api/firebase";
import { doc, updateDoc } from "firebase/firestore";

import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import useAuth from "../../Auth/Auth";
import { Alerta } from "../../components/Alert";

export default function ConfigurarCuenta(props) {
  const { open, setOpen } = props;
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const [loading, setLoading] = useState(false);
  const { userData, updatePasswordUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const validar = (value, size, required) => {
    if (required) {
      if (value?.length === size) return true;
      else return false;
    } else {
      if (value?.length >= size || value?.length === 0 || value === undefined)
        return true;
      else return false;
    }
  };

  const validarConfirmarContrasena = (value) => {
    if (
      getFieldProps("nuevaContrasena").value === "" ||
      getFieldProps("nuevaContrasena").value === undefined ||
      getFieldProps("nuevaContrasena").value.length < 8
    ) {
      if (value === "" || value === undefined) return true;
      else return false;
    }
    if (getFieldProps("nuevaContrasena").value.length >= 8) {
      if (value === getFieldProps("nuevaContrasena").value) return true;
      else return false;
    }
  };

  const LoginSchema = Yup.object().shape({
    nombre: Yup.string().required("Se debe completar este campo"),
    apellidos: Yup.string().required("Se debe completar este campo"),
    ciudad: Yup.string().required("Se debe completar este campo"),
    comuna: Yup.string().required("Se debe completar este campo"),
    direccion: Yup.string().required("Se debe completar este campo"),
    nuevaContrasena: Yup.string().test(
      "nuevaContrasena test",
      "La contraseña debe tener un mínimo de 8 caracteres",
      (value) => validar(value, 8, false)
    ),
    confirmarNuevaContrasena: Yup.string().test(
      "confirmarNuevaContrasena test",
      "Las contraseñas no coinciden",
      (value) => validarConfirmarContrasena(value)
    ),
  });

  const formik = useFormik({
    initialValues: {
      rut: userData.rut,
      nombre: userData.nombreUsuario,
      apellidos: userData.apellidoUsuario,
      ciudad: userData.ciudad,
      comuna: userData.comuna,
      direccion: userData.direccion,
      nuevaContrasena: "",
      confirmarNuevaContrasena: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      guardarDatos();
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, values } = formik;

  const guardarDatos = async () => {
    setLoading(true);
    const usuario = {
      nombreUsuario: values.nombre,
      apellidoUsuario: values.apellidos,
      ciudad: values.ciudad,
      comuna: values.comuna,
      direccion: values.direccion,
    };

    await updateDoc(doc(db, "usuarios", userData.uid), usuario)
      .then(() => {
        setMessage("Datos actualizados correctamente");
        setColor("success");
        setLoading(false);
        new Promise(() => setTimeout(setShowAlert(true), 2000));
      })
      .catch(() => {
        setMessage("Ha ocurrido un error.");
        setColor("error");
        setLoading(false);
        new Promise(() => setTimeout(setShowAlert(true), 2000));
      });

    if (getFieldProps("nuevaContrasena").value !== "") {
      const response = await updatePasswordUser(
        getFieldProps("nuevaContrasena").value
      );
      if (!response) {
        setMessage(
          "Error al actualizar contraseña, Por favor inicie sesión nuevamente"
        );
        setColor("error");
        setLoading(false);
        new Promise(() => setTimeout(setShowAlert(true), 2000));
      }
    }
    handleClose();
  };

  return (
    <>
      <div>
        <Dialog open={open} aria-labelledby="form-dialog-title">
          <DialogTitle
            id="form-dialog-title"
            style={{ backgroundColor: "#1565c0", color: "white" }}
          >
            Cuenta
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Configuración de la cuenta</DialogContentText>

            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="rut"
                  label="Rut"
                  fullWidth
                  disabled={true}
                  {...getFieldProps("rut")}
                  error={Boolean(touched.rut && errors.rut)}
                  helperText={touched.rut && errors.rut}
                />

                <Grid container spacing={2}>
                  <Grid container item xs={6}>
                    <TextField
                      required
                      margin="dense"
                      id="nombre"
                      label="Nombre"
                      fullWidth
                      {...getFieldProps("nombre")}
                      error={Boolean(touched.nombre && errors.nombre)}
                      helperText={touched.nombre && errors.nombre}
                    />
                  </Grid>
                  <Grid container item xs={6}>
                    <TextField
                      required
                      margin="dense"
                      id="apellidos"
                      label="Apellidos"
                      fullWidth
                      {...getFieldProps("apellidos")}
                      error={Boolean(touched.apellidos && errors.apellidos)}
                      helperText={touched.apellidos && errors.apellidos}
                    />
                  </Grid>
                  <Grid container item xs={6}>
                    <TextField
                      required
                      margin="dense"
                      id="ciudad"
                      label="Ciudad"
                      fullWidth
                      {...getFieldProps("ciudad")}
                      error={Boolean(touched.ciudad && errors.ciudad)}
                      helperText={touched.ciudad && errors.ciudad}
                    />
                  </Grid>
                  <Grid container item xs={6}>
                    <TextField
                      required
                      margin="dense"
                      id="comuna"
                      label="Comuna"
                      fullWidth
                      {...getFieldProps("comuna")}
                      error={Boolean(touched.comuna && errors.comuna)}
                      helperText={touched.comuna && errors.comuna}
                    />
                  </Grid>
                </Grid>
                <TextField
                  required
                  margin="dense"
                  id="direccion"
                  label="Dirección"
                  fullWidth
                  {...getFieldProps("direccion")}
                  error={Boolean(touched.direccion && errors.direccion)}
                  helperText={touched.direccion && errors.direccion}
                />
                <TextField
                  style={{ marginTop: ".5rem" }}
                  fullWidth
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  label="Nueva Contraseña"
                  {...getFieldProps("nuevaContrasena")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                          }
                          edge="end"
                        >
                          <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(
                    touched.nuevaContrasena && errors.nuevaContrasena
                  )}
                  helperText={touched.nuevaContrasena && errors.nuevaContrasena}
                />

                <TextField
                  style={{ marginTop: ".5rem" }}
                  fullWidth
                  autoComplete="new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirmar Nueva Contraseña"
                  {...getFieldProps("confirmarNuevaContrasena")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setConfirmShowPassword(
                              (showConfirmPassword) => !showConfirmPassword
                            )
                          }
                          edge="end"
                        >
                          <Icon
                            icon={showConfirmPassword ? eyeFill : eyeOffFill}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(
                    touched.confirmarNuevaContrasena &&
                      errors.confirmarNuevaContrasena
                  )}
                  helperText={
                    touched.confirmarNuevaContrasena &&
                    errors.confirmarNuevaContrasena
                  }
                />
                <DialogActions>
                  <LoadingButton onClick={handleClose} color="error">
                    Cerrar
                  </LoadingButton>
                  <LoadingButton
                    type="submit"
                    color="primary"
                    startIcon={<Icon icon={saveFill} />}
                    loading={loading}
                  >
                    Guardar Cambios
                  </LoadingButton>
                  {showAlert && (
                    <Alerta
                      showAlert={showAlert}
                      setShowAlert={setShowAlert}
                      message={message}
                      color={color}
                    />
                  )}
                </DialogActions>
              </Form>
            </FormikProvider>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
