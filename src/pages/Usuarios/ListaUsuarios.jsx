import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import useGetData from '../../hooks/useGetData';
import { Container, Grid, TextField, Box, Collapse, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import usePutData from '../../hooks/usePutData';

const headCells = [
  { id: 'fechaInicio', numeric: false, disablePadding: false, label: 'Fecha Inicio' },
  { id: 'fechaFin', numeric: false, disablePadding: false, label: 'Fecha Fin' },
  { id: 'documento', numeric: false, disablePadding: false, label: 'Documento' },
  { id: 'nombre', numeric: false, disablePadding: false, label: 'Nombre' },
  { id: 'correo', numeric: false, disablePadding: false, label: 'Correo' },
  { id: 'observaciones', numeric: false, disablePadding: false, label: 'Observaciones' },
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: 150
}));

export function ListaUsuarios() {
  const { data, error, loading } = useGetData(["usuarios"]);
  const usuarios = data?.usuarios || [];
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fechaInicio');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filter, setFilter] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  const handlePutData = usePutData(`usuarios`, () => {
    setEditMode(null);
  });
  
  const handleEditClick = (event, row) => {
    if (editMode === row.documento) {
      console.log(editMode);
      // Save changes to backend using custom hook
      handlePutData({ ...editedRow, documento: row.documento });
    } else {
      setEditMode(row.documento);
      setEditedRow(row);
    }
  };

  const handleInputChange = (event, field) => {
    const value = event.target.value;
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (loading) {
      console.log('Cargando datos...');
    } else if (error) {
      console.error('Error al obtener los datos:', error);
    } else {
      console.log('Datos obtenidos:', usuarios);
    }
  }, [data, error, loading]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    usuario.observaciones.toLowerCase().includes(filter.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(filter.toLowerCase()) ||
    new Date(usuario.fechaInicio).toLocaleDateString().includes(filter) ||
    new Date(usuario.fechaFin).toLocaleDateString().includes(filter)
  );

  const sortedUsuarios = stableSort(filteredUsuarios, getComparator(order, orderBy));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedUsuarios.length - page * rowsPerPage);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} marginTop={5} padding={3}>
        <Grid item xs={12}>
          <TextField
            label="Buscar usuario"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            placeholder="Ej: nombre, correo, documento"
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
                  {sortedUsuarios
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.serial);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <React.Fragment key={row.documento}>
                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            selected={isItemSelected}
                          >
                          {editMode === row.documento ? (
                              <>
                                <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.fechaInicio}
                                    onChange={(event) => handleInputChange(event, 'fechaInicio')}
                                  />
                                ) : (
                                  new Date(row.fechaInicio).toLocaleDateString()
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.fechaFin}
                                    onChange={(event) => handleInputChange(event, 'fechaFin')}
                                  />
                                ) : (
                                  new Date(row.fechaFin).toLocaleDateString()
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.documento}
                                    onChange={(event) => handleInputChange(event, 'documento')}
                                  />
                                ) : (
                                  row.documento
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.nombre}
                                    onChange={(event) => handleInputChange(event, 'nombre')}
                                  />
                                ) : (
                                  row.nombre
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.correo}
                                    onChange={(event) => handleInputChange(event, 'correo')}
                                  />
                                ) : (
                                  row.correo
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.observaciones}
                                    onChange={(event) => handleInputChange(event, 'observaciones')}
                                  />
                                ) : (
                                  row.observaciones
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.estado}
                                    onChange={(event) => handleInputChange(event, 'estado')}
                                  />
                                ) : (
                                  row.estado
                                )}
                              </TableCell>
                              <TableCell padding="checkbox">
                                <IconButton onClick={(event) => handleEditClick(event, row)}>
                                 {editMode === row.documento ? <SaveIcon /> : <EditIcon />}
                                </IconButton>
                              </TableCell>
                              </>
                            ) : (
                              <>
                            <TableCell component="th" id={labelId} scope="row">
                              {new Date(row.fechaInicio).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{new Date(row.fechaFin).toLocaleDateString()}</TableCell>
                            <TableCell>{row.documento}</TableCell>
                            <TableCell>{row.nombre}</TableCell>
                            <TableCell>{row.correo}</TableCell>
                            <TableCell>{row.observaciones}</TableCell>
                            <TableCell>{row.estado ? <ToggleOnIcon color='primary' /> : <ToggleOffIcon sx={{ fontSize: 30 }} color='primary' />}</TableCell>
                            <TableCell padding="checkbox">
                                  <IconButton onClick={(event) => handleEditClick(event, row)}>
                                    {editMode === row.documento ? <SaveIcon /> : <EditIcon />}
                                  </IconButton>
                            </TableCell>
                            </>
                            )}
                          </TableRow>
                          {/* <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                              <Collapse in={isItemSelected} timeout="auto" unmountOnExit>
                                <Box margin={1}>
                                  <Typography variant="h6" gutterBottom component="div">
                                    Historial de mantenimientos
                                  </Typography>
                                  {/* Aquí integras el componente de historial de mantenimientos */}
                                  {/* <Table size="small" aria-label="historial-mantenimientos">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Fecha Prox Mantenimiento</TableCell>
                                        <TableCell>Objetivo</TableCell>
                                        <TableCell>Cantidad</TableCell>
                                      </TableRow>
                                    </TableHead> } } 
                                    {/* <TableBody>
                                      {mantenimientos.map((mantenimiento) => (
                                        <TableRow key={mantenimiento.id}>
                                          <TableCell component="th" scope="row">
                                            {new Date(mantenimiento.fechaProxMantenimiento).toLocaleDateString()}
                                          </TableCell>
                                          <TableCell>{mantenimiento.objetivo}</TableCell>
                                          <TableCell>{mantenimiento.tipoMantenimiento}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody> */}
                                  {/* </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow> */}
                        </React.Fragment>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[8, 16, 24, 32]}
              component="div"
              count={sortedUsuarios.length}
              rowsPerPage={rowsPerPage}
              page={page}
              labelRowsPerPage="Número de filas"
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Cambiar estilo"
            style={{ marginTop: 3 }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
