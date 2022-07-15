import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/HighlightOff";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
// material
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Step,
  StepLabel,
  Stepper,
  Alert,
  Container,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import LoadingButton from "@mui/lab/LoadingButton";
import { validateRut, formatRut, RutFormat } from "@fdograph/rut-utilities";
import useAuth from "../../Auth/Auth";
import TablaCosecheros from "./TablaCosecherosExcel";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
const styles = makeStyles((theme) => ({
  hidden: {
    display: "none",
  },
  Container: {
    marginTop: 40,
  },
  space: {
    marginTop: 10,
  },
}));

export default function ModalAgregarUsuarioExcel(props) {
  const {
    openSubirExcel,
    setOpenSubirExcel,
    setColor,
    setMessage,
    setAlerta,
    setOpenSeleccion,
  } = props;

  const steps = ["Plantilla", "Subida Excel", "Tabla Usuarios"];
  const [activeStep, setActiveStep] = useState(0);
  const { userData } = useAuth();
  const classes = styles();

  const [guardando, setGuardando] = useState(false);
  const [datosCosecheros, setDatosCosecheros] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [archivoSubido, setArchivoSubido] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  const handleFileInput = (e) => {
    const fileAux = e.target.files[0];
    if (fileAux === undefined) {
      return;
    }
    if (
      fileAux.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setMessage("Solo se admiten documentos en formato xlsx.");
      setColor("error");
      setAlerta(true);
      return;
    }
    setArchivo(fileAux);
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setArchivoSubido(dataParse);
    };
    reader.readAsBinaryString(fileAux);
  };

  const generarUsuarios = () => {
    let cosecherosAux = [];
    archivoSubido.map((archivo) =>
      archivo[0] !== "Rut Cosechero"
        ? cosecherosAux.push({
            uid: formatRut(archivo[0].toString(), RutFormat.DOTS_DASH),
            nombreUsuario: archivo[1].split(" ", 2)[0],
            apellidoUsuario:
              archivo[1].split(" ", 2)[1] === undefined
                ? ""
                : archivo[1].split(" ", 2)[1],
            rut: formatRut(archivo[0].toString(), RutFormat.DOTS_DASH),
            cuid: userData.rol === "company" ? userData.uid : userData.cuid,
            rol: "harvester",
            habilitado: true,
            ciudad: "",
            comuna: "",
            direccion: "",
            fechaCreacion: new Date(),
          })
        : false
    );
    console.log(cosecherosAux);
    setDatosCosecheros(cosecherosAux);
  };

  const validar = () => {
    const isValidRutCliente = !datosCosecheros.some(
      (cosechero) => validateRut(cosechero.rut + "") === false
    );
    if (isValidRutCliente && datosCosecheros.length > 0) {
      guardarDatos();
    } else {
      if (datosCosecheros.length === 0) {
        setMessage("No hay cosecheros que generar");
      } else {
        setMessage("El rut de alguno de los cosecheros no es válido");
      }
      setColor("error");
      setAlerta(true);
    }
  };
  const guardarDatos = () => {
    setGuardando(true);
    datosCosecheros.map(
      async (data) =>
        await setDoc(doc(db, "usuarios", data.rut), data)
          .then(() => {
            setMessage("Se ha guardado correctamente en la base de datos");
            setColor("success");
            setGuardando(false);
            setOpenSubirExcel(false);
            setOpenSeleccion(false);
            setAlerta(true);
          })
          .catch((e) => {
            console.log(e);
            setMessage("Ha ocurrido un error");
            setColor("error");
            setAlerta(true);
          })
    );
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (downloaded) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setColor("info");
        setMessage("Primero debe descargar el archivo");
        setAlerta(true);
      }
    }
    if (activeStep === 1) {
      if (archivo !== null) {
        generarUsuarios();
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setColor("info");
        setMessage("Debe seleccionar un archivo");
        setAlerta(true);
      }
    }
    if (activeStep === 2) {
      validar();
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      setOpenSubirExcel(false);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDeleteFile = () => {
    setArchivo(null);
  };

  const descargarExcel = () => {
    let worksheet = XLSX.utils.aoa_to_sheet([
      ["Rut Cosechero", "Nombre y Apellido Cosechero"],
    ]);
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      new_workbook,
      worksheet,
      "Plantilla Cosecheros"
    );
    XLSX.writeFile(new_workbook, "Plantilla Cosecheros.xlsx");
    setDownloaded(true);
  };

  return (
    <>
      <Dialog
        open={openSubirExcel}
        fullWidth={true}
        aria-labelledby="form-dialog-title"
        maxWidth={"lg"}
      >
        <DialogTitle id="form-dialog-title">Creación Cosecheros</DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => {
                return (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === 0 ? (
              <React.Fragment>
                <Container className={classes.Container}>
                  <Alert severity="info">
                    Haga click en el botón 'Descargar Archivo' para obtener y
                    visualizar la plantilla que será utilizada para subir los
                    cosecheros.
                  </Alert>
                </Container>
                <Container className={classes.space}>
                  <label htmlFor={"contained-button-file"}>
                    <Button
                      fullWidth
                      component="span"
                      m={1}
                      variant="contained"
                      onClick={() => descargarExcel()}
                    >
                      <DownloadIcon /> Descargar Archivo
                    </Button>
                  </label>
                </Container>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {activeStep === 1 && (
                  <React.Fragment>
                    <Container className={classes.Container}>
                      <Alert severity="info">
                        Haga click en el botón 'Seleccionar Archivo' para subir
                        un archivo Excel.
                      </Alert>
                    </Container>
                    <Container className={classes.space}>
                      <input
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        className={classes.hidden}
                        id="contained-button-file"
                        onChange={handleFileInput}
                        type="file"
                      />

                      <label htmlFor={"contained-button-file"}>
                        <Button
                          fullWidth
                          component="span"
                          m={1}
                          variant="contained"
                        >
                          Seleccionar Archivo
                        </Button>
                      </label>
                      {archivo && (
                        <span>
                          <span>
                            <> {archivo.name}</>
                          </span>

                          <span>
                            <IconButton
                              onClick={handleDeleteFile}
                              aria-label="delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </span>
                      )}
                    </Container>
                  </React.Fragment>
                )}

                {activeStep === 2 && (
                  <TablaCosecheros
                    cosecheros={datosCosecheros}
                    setCosecheros={setDatosCosecheros}
                  />
                )}
              </React.Fragment>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Container style={{ margin: 20 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
              <Button
                color="inherit"
                onClick={handleBack}
                sx={{ mr: 1 }}
                disabled={guardando}
              >
                Volver
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <LoadingButton onClick={handleNext} loading={guardando}>
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </LoadingButton>
              <Button></Button>
            </Box>
          </Container>
        </DialogActions>
      </Dialog>
    </>
  );
}
