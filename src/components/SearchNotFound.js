import PropTypes from "prop-types";
// material
import { Paper, Typography } from "@mui/material";

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({
  searchQuery = "",
  searchFilter = false,
  ...other
}) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        No encontrado
      </Typography>
      <Typography variant="body2" align="center">
        {searchFilter
          ? "No se han hallado resultados para la busqueda o para la fecha seleccionada."
          : "No se han hallado resultados."}
      </Typography>
    </Paper>
  );
}
