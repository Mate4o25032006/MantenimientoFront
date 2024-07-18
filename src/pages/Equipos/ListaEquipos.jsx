import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  FormControlLabel,
  Switch,
  Container,
  Grid,
  Box,
  Collapse,
  IconButton,
  Typography
} from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';
import SearchIcon from '@mui/icons-material/Search';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import useGetData from '../../hooks/useGetData';

const headCells = [
  { id: 'seleccion', numeric: false, disablePadding: false, label: '' },
  { id: 'fechaCompra', numeric: false, disablePadding: false, label: 'Fecha Compra' },
  { id: 'serial', numeric: false, disablePadding: false, label: 'Serial' },
  { id: 'marca', numeric: false, disablePadding: false, label: 'Marca' },
  { id: 'referencia', numeric: false, disablePadding: false, label: 'Ref' },
  { id: 'cuentaDante', numeric: false, disablePadding: false, label: 'Cuenta Dante' },
  { id: 'placaSena', numeric: false, disablePadding: false, label: 'Placa Sena' },
  { id: 'tipoEquipo', numeric: false, disablePadding: false, label: 'Tipo Equipo' },
  { id: 'area', numeric: false, disablePadding: false, label: 'Area' },
  { id: 'estado', numeric: false, disablePadding: false, label: 'Estado' },
  { id: 'acciones', numeric: false, disablePadding: false, label: 'Acciones' },
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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200], // Fondo gris claro
  color: '#1565c0',
  fontWeight: 'bold',
}));

export function ListaEquipos() {
  const { data, error, loading } = useGetData(["equipos", "mantenimientos"]);
  const mantenimientos = data?.mantenimientos;
  const equipos = data?.equipos || [];
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fechaCompra');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filter, setFilter] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  useEffect(() => {
    if (loading) {
      console.log('Cargando datos...');
    } else if (error) {
      console.error('Error al obtener los datos:', error);
    } else {
      console.log('Datos obtenidos:', equipos);
    }
  }, [data, error, loading]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, serial) => {
    const selectedIndex = selected.indexOf(serial);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, serial);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleEditClick = (event, row) => {
    setEditMode(row.serial);
    setEditedRow(row);
  };

  const handleInputChange = (event, field) => {
    const value = event.target.value;
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const isSelected = (serial) => selected.indexOf(serial) !== -1;

  const filteredEquipos = equipos.filter(equipo =>
    equipo.marca.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.referencia.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.cuentaDante.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.tipoEquipo.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.area.zona.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.serial.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.placaSena.toLowerCase().includes(filter.toLowerCase()) ||
    new Date(equipo.fechaCompra).toLocaleDateString().includes(filter)
  );

  const sortedEquipos = stableSort(filteredEquipos, getComparator(order, orderBy));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedEquipos.length - page * rowsPerPage);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} marginTop={5} padding={3}>
        <Grid item xs={12}>
          <TextField
            label="Buscar equipo"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            placeholder="Ej: Marca, cuentadante, referencia"
            InputProps={{
              startAdornment: <SearchIcon style={{ color: '#1565c0', marginRight: 8 }} />,
            }}
            style={{ marginBottom: 10 }}
          />
          <Paper>
            <TableContainer>
              <Table
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
              >
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <StyledTableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : 'asc'}
                          onClick={() => handleRequestSort(headCell.id)}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedEquipos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      console.log(row);
                      const isItemSelected = isSelected(row.serial);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <React.Fragment key={row.serial}>
                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            selected={isItemSelected}
                          >
                            <TableCell>
                              <IconButton aria-label="expand row" size="small" onClick={(event) => handleClick(event, row.serial)}>
                                {isItemSelected ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell>
                            {editMode === row.serial ? (
                              <>
                                <TableCell>
                                  <TextField
                                    value={editedRow.fechaCompra}
                                    onChange={(event) => handleInputChange(event, 'fechaCompra')}
                                    fullWidth
                                    InputProps={{
                                    style: { minWidth: 150 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={editedRow.serial}
                                    onChange={(event) => handleInputChange(event, 'serial')}
                                    fullWidth
                                    InputProps={{
                                      style: { minWidth: 150 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={editedRow.marca}
                                    onChange={(event) => handleInputChange(event, 'marca')}
                                    fullWidth
                                    InputProps={{
                                      style: { minWidth: 150 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={editedRow.referencia}
                                    onChange={(event) => handleInputChange(event, 'referencia')}
                                    fullWidth
                                    InputProps={{
                                      style: { minWidth: 150 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={editedRow.cuentaDante.nombre}
                                    onChange={(event) => handleInputChange(event, 'cuentaDante')}
                                    fullWidth
                                    InputProps={{
                                      style: { minWidth: 150 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={editedRow.placaSena}
                                    onChange={(event) => handleInputChange(event, 'placaSena')}
                                    fullWidth
                                    InputProps={{
                                      style: { minWidth: 150 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={editedRow.tipoEquipo.nombre}
                                    onChange={(event) => handleInputChange(event, 'tipoEquipo')}
                                    fullWidth
                                    InputProps={{
                                      style: { minWidth: 150 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={editedRow.area.zona}
                                    onChange={(event) => handleInputChange(event, 'area')}
                                    fullWidth
                                    InputProps={{
                                      style: { minWidth: 150 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={editedRow.estado}
                                    onChange={(event) => handleInputChange(event, 'estado')}
                                    fullWidth
                                    InputProps={{
                                      style: { minWidth: 150 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    aria-label="edit"
                                    onClick={(event) => handleEditClick(event, row)}
                                  >
                                    <EditIcon sx={{ fontSize: 20 }} color='primary' />
                                  </IconButton>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell component="th" id={labelId} scope="row">
                                  {new Date(row.fechaCompra).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{row.serial}</TableCell>
                                <TableCell>{row.marca}</TableCell>
                                <TableCell>{row.referencia}</TableCell>
                                <TableCell>{row.cuentaDante.nombre}</TableCell>
                                <TableCell>{row.placaSena}</TableCell>
                                <TableCell>{row.tipoEquipo.nombre}</TableCell>
                                <TableCell>{row.area.zona}</TableCell>
                                <TableCell>{row.estado ? <ToggleOnIcon color='primary' /> : <ToggleOffIcon sx={{ fontSize: 30 }} color='primary' />}</TableCell>                                <TableCell>
                                  <IconButton
                                    aria-label="edit"
                                    onClick={(event) => handleEditClick(event, row)}
                                  >
                                    <EditIcon sx={{ fontSize: 20 }} color='primary' />
                                  </IconButton>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                          {isItemSelected && (
                            <TableRow>
                              <TableCell colSpan={headCells.length}>
                                <Collapse in={isItemSelected} timeout="auto" unmountOnExit>
                                  <Box margin={1}>
                                    <Typography variant="h6" gutterBottom component="div">
                                      Mantenimientos
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Fecha Mantenimiento</TableCell>
                                          <TableCell>Objetivo</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {mantenimientos
                                          // .filter((mant) => mant.equipo.serial === row.serial)
                                          .map((mant) => (
                                            <TableRow key={mant.id}>
                                              <TableCell component="th" scope="row">
                                                {new Date(mant.fechaProxMantenimiento).toLocaleDateString()}
                                              </TableCell>
                                              <TableCell>{mant.objetivo}</TableCell>
                                            </TableRow>
                                          ))}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[8, 16, 24]}
              component="div"
              count={sortedEquipos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default ListaEquipos;
