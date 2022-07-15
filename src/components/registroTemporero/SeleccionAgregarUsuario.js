import React, { useState } from "react";

// material
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Autocomplete,
  TextField,
  Container,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import LoadingButton from "@mui/lab/LoadingButton";

const styles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
    marginBottom: 12,
    marginTop: 60,
  },
  boton: {
    maxHeight: "3.2rem",
    minWidth: "100%",
    marginTop: 17,
  },
  selectMenu: {
    minWidth: "100%",
    marginBottom: 12,
  },
  Container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
}));

export default function ModalSeleccion(props) {
  const {
    openSeleccion,
    setOpenSeleccion,
    setOpenAgregarUsuario,
    setOpenSubirExcel,
    setColor,
    setMessage,
    setAlerta,
  } = props;

  const [forma, setForma] = useState({
    label: "De Forma Manual",
    value: "MANUAL",
  });

  const classes = styles();
  const options = [
    { label: "De Forma Manual", value: "MANUAL" },
    { label: "Subir Excel Cosecheros", value: "EXCEL" },
  ];

  const siguiente = () => {
    if (forma !== null) {
      if (forma.value === "MANUAL") {
        setOpenAgregarUsuario(true);
      } else {
        setOpenSubirExcel(true);
      }
    } else {
      setColor("error");
      setMessage("Debe seleccionar un método");
      setAlerta(true);
    }
  };

  return (
    <>
      <Dialog
        open={openSeleccion}
        aria-labelledby="form-dialog-title"
        maxWidth={"lg"}
      >
        <DialogTitle id="form-dialog-title">
          Seleccione un método de creación del plan masivo
        </DialogTitle>
        <DialogContent>
          <Container className={classes.Container}>
            <Autocomplete
              disablePortal
              value={forma}
              onChange={(event, newValue) => {
                setForma(newValue);
              }}
              isOptionEqualToValue={(option, value) => {
                return option.value === value.value;
              }}
              id="combo-box-demo"
              options={options}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Seleccione un método" />
              )}
            />
          </Container>
        </DialogContent>

        <DialogActions>
          <Container style={{ margin: 20 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
              <Button
                color="inherit"
                onClick={() => setOpenSeleccion(false)}
                sx={{ mr: 1 }}
              >
                Cerrar
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <LoadingButton onClick={siguiente}>Siguiente</LoadingButton>
            </Box>
          </Container>
        </DialogActions>
      </Dialog>
    </>
  );
}
