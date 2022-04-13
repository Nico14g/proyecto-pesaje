import React, { useEffect, useState } from "react";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import plusFill from "@iconify/icons-eva/plus-fill";
import eyeFill from "@iconify/icons-eva/eye-fill";
import edit from "@iconify/icons-eva/edit-2-fill";
import { Alerta } from "../Alert";
import * as locales from "@mui/material/locale";
// material
import {
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Container,
  Button,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import { TablaHead, TablaToolbar } from "../tablas";
import Scrollbar from "../Scrollbar";
import SearchNotFound from "../SearchNotFound";

import useAuth from "../../Auth/Auth";
import ModalBandeja from "./ModalBandeja";

const TABLE_HEAD = [
  { id: "nombre", label: "Nombre Bandeja", alignRight: false },
  { id: "dcto", label: "Peso Tara", alignRight: false },
  { id: "acciones", label: "Acciones", alignRight: false },
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
    return filter(array, (_user) => {
      return (
        _user.nombre.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.dcto
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) !== -1
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TablaBandejas(props) {
  const { bandejas } = props;
  const [locale] = useState("esES");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("nombreTarea");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const [visualizar, setVisualizar] = useState(false);
  const [editar, setEditar] = useState(false);
  const [bandeja, setBandeja] = useState({
    nombre: "",
    dcto: 0.1,
  });
  const { userData } = useAuth();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = bandejas?.map((n) => n.nombreTarea);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bandejas?.length) : 0;

  const filteredUsers = applySortFilter(
    bandejas,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    if (bandejas !== undefined) {
      setLoadingTable(false);
    }
  }, [bandejas]);

  const handleAgregar = () => {
    setBandeja({
      nombre: "",
      dcto: 0.1,
    });
    setEditar(false);
    setVisualizar(false);
    setOpen(true);
  };

  const handleVisualizar = (bandeja) => {
    setBandeja(bandeja);
    setEditar(false);
    setVisualizar(true);
    setOpen(true);
  };

  const handleEditar = (bandeja) => {
    setBandeja(bandeja);
    setEditar(true);
    setVisualizar(false);
    setOpen(true);
  };

  return (
    <Paper>
      <Grid
        container
        style={{ padding: "1rem 1.5rem 0rem 1.5rem" }}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs md>
          <TablaToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
        </Grid>
        {userData.rol !== "planner" && (
          <Grid item xs md style={{ marginRight: 60 }}>
            <Grid container direction="row-reverse">
              <Grid item xs={12} md={6}>
                <Container>
                  <Button
                    variant="contained"
                    onClick={() => handleAgregar()}
                    startIcon={<Icon icon={plusFill} />}
                    style={{ minWidth: "220px", backgroundColor: "#4BC74F" }}
                  >
                    Agregar Bandeja
                  </Button>
                </Container>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Scrollbar>
        <TableContainer>
          {!loadingTable ? (
            <Table>
              <TablaHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={bandejas?.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, dcto, nombre } = row;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell align="left">
                          <Typography variant="subtitle2">{nombre}</Typography>
                        </TableCell>
                        <TableCell align="left">{dcto} KG</TableCell>
                        <TableCell align="left">
                          <IconButton
                            onClick={() =>
                              handleEditar(
                                filteredUsers.find(
                                  (bandeja) => bandeja.id === id
                                )
                              )
                            }
                            edge="end"
                          >
                            <Icon icon={edit} color="#4BC74F" />
                          </IconButton>{" "}
                          <IconButton
                            onClick={() =>
                              handleVisualizar(
                                filteredUsers.find(
                                  (bandeja) => bandeja.id === id
                                )
                              )
                            }
                            edge="end"
                          >
                            <Icon icon={eyeFill} color="#4BC74F" />
                          </IconButton>{" "}
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
                    <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                      <SearchNotFound
                        searchFilter={true}
                        searchQuery={filterName}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          ) : (
            <Skeleton variant="rectangular" width="100%" height="500px" />
          )}
        </TableContainer>
      </Scrollbar>

      <ThemeProvider
        theme={(outerTheme) => createTheme(outerTheme, locales[locale])}
      >
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={bandejas?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
      {open && (
        <ModalBandeja
          open={open}
          setOpen={setOpen}
          setShowAlert={setShowAlert}
          setMessage={setMessage}
          setColor={setColor}
          bandeja={bandeja}
          visualizar={visualizar}
          editar={editar}
        />
      )}
      {showAlert && (
        <Alerta
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          color={color}
          message={message}
        />
      )}
    </Paper>
  );
}
