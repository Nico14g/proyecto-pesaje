import React, { useEffect, useState } from "react";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import eyeFill from "@iconify/icons-eva/eye-fill";
import plusFill from "@iconify/icons-eva/plus-fill";
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
  IconButton,
  Container,
  Button,
} from "@mui/material";
import { TablaHead, TablaToolbar } from "../tablas";
import Scrollbar from "../Scrollbar";
import SearchNotFound from "../SearchNotFound";
import ModalFormulario from "./ModalFormulario";

const TABLE_HEAD = [
  { id: "run", label: "Rut", alignRight: false },
  { id: "nombreUsuario", label: "Nombre", alignRight: false },
  { id: "rol", label: "Rol", alignRight: false },
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
        _user.run.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.lastName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.rol.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TablaUsuarios(props) {
  const { usuarios } = props;
  const [locale] = useState("esES");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("nombreTarea");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [visualizar, setVisualizar] = useState("");
  const [loadingTable, setLoadingTable] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const [usuario, setUsuario] = useState({
    firstName: "",
    lastName: "",
    run: "",
    address: "",
    city: "",
    state: "",
    email: "",
    rol: "",
    password: "",
    admissionDate: "",
    isenabled: "",
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = usuarios?.map((n) => n.nombreTarea);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usuarios?.length) : 0;

  const filteredUsers = applySortFilter(
    usuarios,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    if (usuarios !== undefined) {
      setLoadingTable(false);
    }
  }, [usuarios]);

  const mostrarRol = (rol) => {
    if (rol === "harvester") return "Cosechador";
    if (rol === "admin") return "Administrador";
    if (rol === "company") return "Empresa";
    if (rol === "planner") return "Planillero";
  };

  const handleAgregar = () => {
    setUsuario({
      firstName: "",
      lastName: "",
      run: "",
      address: "",
      city: "",
      state: "",
      email: "",
      rol: "",
      password: "",
      admissionDate: "",
    });
    setVisualizar(false);
    setOpen(true);
  };

  const handleVisualizar = (user) => {
    setUsuario(user);
    setVisualizar(true);
    setOpen(true);
  };
  return (
    <>
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
        <Grid item xs md>
          <Grid container direction="row-reverse">
            <Grid item xs={12} md={6}>
              <Container>
                <Button
                  variant="contained"
                  onClick={() => handleAgregar()}
                  startIcon={<Icon icon={plusFill} />}
                  style={{ minWidth: "200px", backgroundColor: "#4BC74F" }}
                >
                  Agregar Usuario
                </Button>
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Scrollbar>
        <TableContainer>
          {!loadingTable ? (
            <Table>
              <TablaHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={usuarios?.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { run, firstName, lastName, rol } = row;
                    return (
                      <TableRow hover key={run} tabIndex={-1} role="checkbox">
                        <TableCell align="left">
                          <Typography variant="subtitle2">{run}</Typography>
                        </TableCell>
                        <TableCell align="left">
                          {firstName} {lastName}
                        </TableCell>
                        <TableCell align="left">{mostrarRol(rol)}</TableCell>
                        <TableCell align="left">
                          {" "}
                          <IconButton
                            onClick={() =>
                              handleVisualizar(
                                filteredUsers.find((user) => user.run === run)
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
          count={usuarios?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>

      {open && (
        <ModalFormulario
          open={open}
          setOpen={setOpen}
          setShowAlert={setShowAlert}
          setMessage={setMessage}
          setColor={setColor}
          usuario={usuario}
          visualizar={visualizar}
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
    </>
  );
}
