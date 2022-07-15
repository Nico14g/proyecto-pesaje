import React, { useState } from "react";
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Button,
  Typography,
} from "@mui/material";
import { filter } from "lodash";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import Scrollbar from "../Scrollbar";
import { TablaHead } from "../tablas";

const TABLE_HEAD = [
  { id: "rutCosechero", label: "Rut Cosechero", alignRight: false },
  { id: "nombreCosechero", label: "Nombre", alignRight: false },
  { id: "apellidoCosechero", label: "Apellido", alignRight: false },
  { id: "" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.nombreUsuario.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TablaCosecheros(props) {
  const { cosecheros, setCosecheros } = props;

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("nombre");
  const filterName = "";
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locale] = useState("esES");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = cosecheros?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cosecheros?.length) : 0;

  const filteredUsers = applySortFilter(
    cosecheros,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  const eliminar = (row) => {
    const totalPlanes = [...cosecheros];
    const index = totalPlanes.indexOf(row);
    totalPlanes.splice(index, 1);
    setCosecheros(totalPlanes);
  };

  return (
    <div>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TablaHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={cosecheros?.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { rut, nombreUsuario, apellidoUsuario } = row;
                    const isItemSelected = selected.indexOf(rut) !== -1;

                    return (
                      <TableRow
                        hover
                        key={rut}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell>
                          <Typography variant="subtitle2">{rut}</Typography>
                        </TableCell>
                        <TableCell align="left">{nombreUsuario}</TableCell>
                        <TableCell align="left">{apellidoUsuario}</TableCell>

                        <TableCell align="right">
                          <Button
                            color="error"
                            onClick={() => {
                              eliminar(row);
                            }}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      No se han agregado elementos
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <ThemeProvider
          theme={(outerTheme) => createTheme(outerTheme, locales[locale])}
        >
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={cosecheros?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ThemeProvider>
      </Card>
    </div>
  );
}
