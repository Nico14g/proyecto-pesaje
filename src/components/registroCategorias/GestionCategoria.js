import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { db } from "../../api/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function GestionCategoria(props) {
  const {
    open,
    setOpen,
    selectedCategoria,
    setMessage,
    setColor,
    setShowAlert,
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen(false);
  };

  const guardar = async () => {
    let fechaTermino;
    if (selectedCategoria.fechaTermino === "") {
      fechaTermino = new Date();
    } else {
      fechaTermino = "";
    }
    await updateDoc(doc(db, "categoria", selectedCategoria.idCategoria), {
      fechaTermino: fechaTermino,
    })
      .then(() => {
        setMessage("Datos actualizados correctamente");
        setColor("success");
        setShowAlert(true);
        setOpen(false);
      })
      .catch(() => {
        setMessage("Ha ocurrido un error.");
        setColor("error");
        setShowAlert(true);
        setOpen(false);
      });
  };
  const Title = ({ children }) => (
    <div style={{ color: theme.palette.primary }}>{children}</div>
  );
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          style={{ backgroundColor: "#1565c0", color: "white" }}
        >
          {selectedCategoria.fechaTermino === ""
            ? "¿Desea cerrar esta categoría?"
            : "¿Desea reabrir esta categoría?"}
        </DialogTitle>

        <DialogActions>
          <Button autoFocus onClick={handleClose} color="error">
            Cancelar
          </Button>
          <Button onClick={guardar} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
