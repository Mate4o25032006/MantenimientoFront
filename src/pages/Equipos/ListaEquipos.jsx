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
import SaveIcon from '@mui/icons-material/Save';
import { Select } from '@/components/forms/elements/select';
import useGetData from '../../hooks/useGetData';
import usePutData from '../../hooks/usePutData';

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
  if (orderBy === 'tipoEquipo') {
    if (b[orderBy].nombre < a[orderBy].nombre) {
      return -1;
    }
    if (b[orderBy].nombre > a[orderBy].nombre) {
      return 1;
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: 150
}));

export function ListaEquipos() {
  const { data, error, loading } = useGetData(["equipos", "mantenimientos", "cuentadantes", "tipoEquipos", "areas", "estados"]);
  const mantenimientos = data?.mantenimientos;
  const cuentadantes = data?.cuentadantes;
  const equipos = data?.equipos || [];
  const tipoEquipos = data?.tipoEquipos;
  const areas = data?.areas;
  const estados = data?.estados;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fechaCompra');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filter, setFilter] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  
  const handlePutData = usePutData(`equipos`, () => {
    setEditMode(null);
  });

  const handleEditClick = (event, row) => {
    if (editMode === row.serial) {
      console.log('Updating:', editedRow);
      const updatedRow = {
        ...editedRow,
        estado: {
          idEstado: editedRow.estado.idEstado,
          estado: editedRow.estado.estado 
        },
        serial: row.serial
      };
      console.log(updatedRow);
      handlePutData(updatedRow);
    } else {
      setEditMode(row.serial);
      setEditedRow(row);
    }
  };
  
  const handleInputChange = (event, field) => {
    const value = event.target.value;
    if (field === 'estado') {
      setEditedRow((prevState) => ({
        ...prevState,
        estado: {
          ...prevState.estado,
          estado: value === "Activo",
          idEstado: value === "Activo" ? 1 : 2
        }
      }));
    } else {
      setEditedRow((prevState) => ({
        ...prevState,
        [field]: value
      }));
    }
  };

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
                                {editMode === row.serial ? (
                                  <StyledTextField
                                    value={editedRow.fechaCompra}
                                    onChange={(event) => handleInputChange(event, 'fechaCompra')}
                                  />
                                ) : (
                                  new Date(row.fechaCompra).toLocaleDateString()
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.serial ? (
                                  <StyledTextField
                                    value={editedRow.serial}
                                    onChange={(event) => handleInputChange(event, 'serial')}
                                  />
                                ) : (
                                  row.serial
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.serial ? (
                                  <StyledTextField
                                    value={editedRow.marca}
                                    onChange={(event) => handleInputChange(event, 'marca')}
                                  />
                                ) : (
                                  row.marca
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.serial ? (
                                  <StyledTextField
                                    value={editedRow.referencia}
                                    onChange={(event) => handleInputChange(event, 'referencia')}
                                  />
                                ) : (
                                  row.referencia
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.serial ? (
                                  <Select
                                    name="cuentaDante"
                                    value={editedRow.cuentaDante ? editedRow.cuentaDante.documento : ''}
                                    onChange={(event) => handleInputChange(event, 'cuentaDante')}
                                    options={cuentadantes.map(cuentaDante => ({ value: cuentaDante.documento, label: cuentaDante.nombre }))}
                                    style={{ height: '60px' }}
                                  />
                                ) : (
                                  row.cuentaDante.nombre
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.serial ? (
                                  <StyledTextField
                                    value={editedRow.placaSena}
                                    onChange={(event) => handleInputChange(event, 'placaSena')}
                                  />
                                ) : (
                                  row.placaSena
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.serial ? (
                                  <Select
                                    name="tipoEquipo"
                                    value={editedRow.tipoEquipo ? editedRow.tipoEquipo.id : ''}
                                    onChange={(event) => handleInputChange(event, 'tipoEquipo')}
                                    options={tipoEquipos.map(tipoEquipo => ({ value: tipoEquipo.id, label: tipoEquipo.nombre }))}
                                    style={{ height: '60px' }}
                                  />
                                ) : (
                                  row.tipoEquipo.nombre
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.serial ? (
                                  <Select
                                    name="area"
                                    value={editedRow.area ? editedRow.area.codigo : ''}
                                    onChange={(event) => handleInputChange(event, 'area')}
                                    options={areas.map(area => ({ value: area.codigo, label: area.zona }))}
                                    style={{ height: '60px' }}
                                  />
                                ) : (
                                  row.area.zona
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.serial ? (
                                <Select
                                  name="estado"
                                  onChange={(event) => handleInputChange(event, 'estado')}
                                  value={editedRow.estado ? "Activo" : "Inactivo"}
                                  style={{ height: '60px' }}
                                  options={[
                                    {
                                      value: "Activo",
                                      label: "Activo",
                                    },
                                    {
                                      value: "Inactivo",
                                      label: "Inactivo",
                                    },
                                  ]}
                                />
                                ) : (
                                  row.estado ? "Activo" : "Inactivo"
                                )}
                              </TableCell>
                              <TableCell padding="checkbox">
                                <IconButton onClick={(event) => handleEditClick(event, row)}>
                                 {editMode === row.serial ? <SaveIcon /> : <EditIcon />}
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
                                <TableCell>{row.estado ? "Activo" : "Inactivo" }</TableCell>                                
                                <TableCell padding="checkbox">
                                  <IconButton onClick={(event) => handleEditClick(event, row)}>
                                    {editMode === row.serial ? <SaveIcon /> : <EditIcon />}
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
                                          <TableCell>Tipo</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                      {row.mantenimientos.length > 0 ? (
                                        row.mantenimientos.map((mantenimiento) => (
                                          <TableRow key={mantenimiento.idMantenimiento}>
                                            <TableCell component="th" scope="row">
                                              {mantenimiento.fechaProxMantenimiento}
                                            </TableCell>
                                            <TableCell>{mantenimiento.objetivo}</TableCell>
                                            <TableCell>{mantenimiento.tipoMantenimiento}</TableCell>
                                          </TableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={3}>No hay mantenimientos</TableCell>
                                        </TableRow>
                                      )}
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
              labelRowsPerPage="Número de filas"
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Cambiar estilo"
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default ListaEquipos;
