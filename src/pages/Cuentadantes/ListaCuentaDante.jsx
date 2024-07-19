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
import useGetData from '../../hooks/useGetData';
import usePutData from '../../hooks/usePutData';

const headCells = [
  // { id: 'seleccion', numeric: false, disablePadding: false, label: '' },
  { id: 'documento', numeric: false, disablePadding: false, label: 'Documento' },
  { id: 'nombre', numeric: false, disablePadding: false, label: 'Nombre' },
  { id: 'dependencia', numeric: false, disablePadding: false, label: 'Dependencia' },
  { id: 'departamento', numeric: false, disablePadding: false, label: 'Departamento' },
  { id: 'tipoContrato', numeric: false, disablePadding: false, label: 'Tipo Contrato' },
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

export function ListaCuentaDante() {
  const { data, error, loading } = useGetData(["cuentadantes"]);
  const cuentadantes = data?.cuentadantes || [];
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('documento');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filter, setFilter] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  
  const handlePutData = usePutData(`cuentadantes`, () => {
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
      console.log('Datos obtenidos:', cuentadantes);
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

  const isSelected = (documento) => selected.indexOf(documento) !== -1;

  const filteredCuentaDantes = cuentadantes.filter(cuentadante =>
    cuentadante.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    cuentadante.dependencia.toLowerCase().includes(filter.toLowerCase()) ||
    cuentadante.departamento.toLowerCase().includes(filter.toLowerCase()) ||
    cuentadante.tipoContrato.toLowerCase().includes(filter.toLowerCase()) 
  );

  const sortedCuentaDantes = stableSort(filteredCuentaDantes, getComparator(order, orderBy));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedCuentaDantes.length - page * rowsPerPage);

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
                  {sortedCuentaDantes
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
                            {/* <TableCell>
                              <IconButton aria-label="expand row" size="small" onClick={(event) => handleClick(event, row.serial)}>
                                {isItemSelected ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell> */}
                            {editMode === row.documento ? (
                              <>
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
                                    value={editedRow.dependencia}
                                    onChange={(event) => handleInputChange(event, 'dependencia')}
                                  />
                                ) : (
                                  row.dependencia
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.departamento}
                                    onChange={(event) => handleInputChange(event, 'departamento')}
                                  />
                                ) : (
                                  row.departamento
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.tipoContrato}
                                    onChange={(event) => handleInputChange(event, 'tipoContrato')}
                                  />
                                ) : (
                                  row.tipoContrato
                                )}
                              </TableCell>
                              {/* <TableCell>
                                {editMode === row.documento ? (
                                  <StyledTextField
                                    value={editedRow.estado}
                                    onChange={(event) => handleInputChange(event, 'estado')}
                                  />
                                ) : (
                                  row.estado
                                )}
                              </TableCell> */}
                              <TableCell padding="checkbox">
                                <IconButton onClick={(event) => handleEditClick(event, row)}>
                                 {editMode === row.documento ? <SaveIcon /> : <EditIcon />}
                                </IconButton>
                              </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell component="th" id={labelId} scope="row">
                                 {row.documento}
                                </TableCell>
                                <TableCell>{row.nombre}</TableCell>
                                <TableCell>{row.dependencia}</TableCell>
                                <TableCell>{row.departamento}</TableCell>
                                <TableCell>{row.tipoContrato}</TableCell>
                                {/* <TableCell>{row.estado ? <ToggleOnIcon color='primary' /> : <ToggleOffIcon sx={{ fontSize: 30 }} color='primary' />}</TableCell>                                 */}
                                <TableCell padding="checkbox">
                                  <IconButton onClick={(event) => handleEditClick(event, row)}>
                                    {editMode === row.documento ? <SaveIcon /> : <EditIcon />}
                                  </IconButton>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                          {/* {isItemSelected && (
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
                          )} */}
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
              count={sortedCuentaDantes.length}
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

export default ListaCuentaDante;
