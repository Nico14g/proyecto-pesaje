import React, { useEffect, useState } from "react";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import plusFill from "@iconify/icons-eva/plus-fill";
import Clock from "@mui/icons-material/Schedule";
import { Alerta } from "../Alert";
import * as locales from "@mui/material/locale";
import Label from "../Label";
import { sentenceCase } from "change-case";
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
import ModalCategoria from "./ModalCategoria";
import useAuth from "../../Auth/Auth";

const TABLE_HEAD = [
  { id: "name", label: "Nombre Categoría", alignRight: false },
  { id: "startDate", label: "Fecha Inicio", alignRight: false },
  { id: "endDate", label: "Fecha Término", alignRight: false },
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
      return _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TablaCategorias(props) {
  const { categorias } = props;
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
  const { userData } = useAuth();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = categorias?.map((n) => n.nombreTarea);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categorias?.length) : 0;

  const filteredUsers = applySortFilter(
    categorias,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    if (categorias !== undefined) {
      setLoadingTable(false);
    }
  }, [categorias]);

  const handleAgregar = () => {
    setOpen(true);
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const mostrarFechaTermino = (dateEnd) => {
    if (dateEnd === "") return true;
    return dateEnd.toDate().toLocaleDateString("es-CL", options);
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
                    Agregar Categoría
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
                rowCount={categorias?.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, name, dateStart, dateEnd } = row;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell align="left">
                          <Typography variant="subtitle2">{name}</Typography>
                        </TableCell>
                        <TableCell align="left">
                          {dateStart
                            .toDate()
                            .toLocaleDateString("es-CL", options)}
                        </TableCell>
                        <TableCell align="left">
                          {mostrarFechaTermino(dateEnd) === true ? (
                            <Label variant="ghost" color={"info"}>
                              <Clock /> <Divider> </Divider>
                              {sentenceCase("En Progreso")}
                            </Label>
                          ) : (
                            mostrarFechaTermino(dateEnd)
                          )}
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
          count={categorias?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
      {open && (
        <ModalCategoria
          open={open}
          setOpen={setOpen}
          setShowAlert={setShowAlert}
          setMessage={setMessage}
          setColor={setColor}
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
