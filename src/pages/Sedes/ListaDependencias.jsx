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
  IconButton,
} from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import useGetData from '../../hooks/useGetData';
import usePutData from '../../hooks/usePutData';
import { Select } from '@/components/forms/elements/select';

const headCells = [
  // { id: 'seleccion', numeric: false, disablePadding: false, label: '' },
  { id: 'idDependencia', numeric: false, disablePadding: false, label: 'Código' },
  { id: 'nombre', numeric: false, disablePadding: false, label: 'Nombre' },
  { id: 'subsede', numeric: false, disablePadding: false, label: 'Subsede' },
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

export function ListaDependencias() {
  const { data, error, loading } = useGetData(["dependencias", "subsedes"]);
  const dependencias = data?.dependencias || [];
  const subsedes = data?.subsedes || [];
  console.log(subsedes)
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filter, setFilter] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  
  const handlePutData = usePutData(`dependencias`, () => {
    setEditMode(null);
  });
  
  const handleEditClick = (event, row) => {
    if (editMode === row.idDependencia) {
      console.log(editMode);
      // Save changes to backend using custom hook
      handlePutData({ ...editedRow, idDependencia: row.idDependencia });
    } else {
      setEditMode(row.idDependencia);
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
      console.log('Datos obtenidos:', dependencias);
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredDependencias = dependencias.filter(dependencia =>
    dependencia.nombre.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedDependencias = stableSort(filteredDependencias, getComparator(order, orderBy));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedDependencias.length - page * rowsPerPage);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} marginTop={3} padding={3}>
        <Grid item xs={12}>
          <h1 className="text-center my-2 mb-3 text-xl font-semibold">Lista Dependencias</h1>
          <TextField
            label="Buscar dependencia"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            placeholder="Ej: nombre"
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
                  {sortedDependencias
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      console.log(row);
                      const isItemSelected = isSelected(row.idDependencia);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <React.Fragment key={row.idDependencia}>
                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            selected={isItemSelected}
                          >
                            {editMode === row.idDependencia ? (
                              <>
                              <TableCell>
                                {editMode === row.idDependencia ? (
                                  <StyledTextField
                                    value={editedRow.idDependencia}
                                    onChange={(event) => handleInputChange(event, 'idDependencia')}
                                  />
                                ) : (
                                  row.idDependencia
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.idDependencia ? (
                                  <StyledTextField
                                    value={editedRow.nombre}
                                    onChange={(event) => handleInputChange(event, 'nombre')}
                                  />
                                ) : (
                                  row.nombre
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode === row.idDependencia ? (
                                  <Select
                                  name="subsede"
                                  value={editedRow.subsede ? editedRow.subsede.idSubsede : ''}
                                  onChange={(event) => handleInputChange(event, 'subsede')}
                                  options={subsedes.map(subsede => ({ value: subsede.idSubsede, label: subsede.nombre }))}
                                  style={{ height: '60px' }}
                                />
                                ) : (
                                  row.subsede.nombre
                                )}
                              </TableCell>
                              <TableCell padding="checkbox">
                                <IconButton onClick={(event) => handleEditClick(event, row)}>
                                 {editMode === row.idDependencia ? <SaveIcon /> : <EditIcon />}
                                </IconButton>
                              </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell component="th" id={labelId} scope="row">
                                 {row.idDependencia}
                                </TableCell>
                                <TableCell>{row.nombre}</TableCell>
                                <TableCell>{row.subsede.nombre}</TableCell>
                                <TableCell padding="checkbox">
                                  <IconButton onClick={(event) => handleEditClick(event, row)}>
                                    {editMode === row.idDependencia ? <SaveIcon /> : <EditIcon />}
                                  </IconButton>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
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
              count={sortedDependencias.length}
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

export default ListaDependencias;
