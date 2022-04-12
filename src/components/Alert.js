import React from "react";
import PropTypes from "prop-types";
import { Snackbar, Alert } from "@mui/material";
import Slide from "@mui/material/Slide";

export const Alerta = (props) => {
  const { showAlert, setShowAlert, color, message } = props;

  function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }
  const handleCloseNotification = () => {
    setShowAlert(false);
  };

  return (
    <div>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => handleCloseNotification()}
        TransitionComponent={TransitionDown}
        key={TransitionDown.name}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => handleCloseNotification()}
          severity={color}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

Alerta.propTypes = {
  showAlert: PropTypes.bool.isRequired,
  setShowAlert: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
