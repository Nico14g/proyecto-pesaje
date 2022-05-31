import React, { useState } from "react";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import {
  CardContent,
  FormControl,
  TextField,
  Grid,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Form } from "formik";

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

export default function FormularioConfirmacion(props) {
  const { formik } = props;
  const classes = styles();

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
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
                    margin="dense"
                    id="correo"
                    label="Correo"
                    fullWidth
                    {...getFieldProps("correo")}
                    error={Boolean(touched.correo && errors.correo)}
                    helperText={touched.correo && errors.correo}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    className={classes.pos}
                    margin="dense"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    label="Contraseña"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    autoComplete="new-password"
                    {...getFieldProps("password")}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
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
