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
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Select } from '@/components/forms/elements/select';
import useGetData from '../../hooks/useGetData';
import usePutData from '../../hooks/usePutData';
import ImportButton from '@/components/equipos/ImportButton';
import { FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const headCells = [
  { id: 'fechaCompra', numeric: false, disablePadding: false, label: 'Fecha Compra' },
  { id: 'serial', numeric: false, disablePadding: false, label: 'Serial' },
  { id: 'marca', numeric: false, disablePadding: false, label: 'Marca' },
  { id: 'referencia', numeric: false, disablePadding: false, label: 'Ref' },
  { id: 'cuentaDante', numeric: false, disablePadding: false, label: 'Cuenta Dante' },
  { id: 'placaSena', numeric: false, disablePadding: false, label: 'Placa Sena' },
  { id: 'tipoEquipo', numeric: false, disablePadding: false, label: 'Tipo Equipo' },
  { id: 'subsede', numeric: false, disablePadding: false, label: 'Subsede' },
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
  backgroundColor: theme.palette.grey[200], 
  color: '#1565c0',
  fontWeight: 'bold',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: 150
}));

export function ListaEquipos() {
  const { data, error, loading } = useGetData(["equipos", "mantenimientos", "cuentadantes", "tipoEquipos", "subsedes", "estados"]);
  const cuentadantes = data?.cuentadantes;
  const equipos = data?.equipos || [];
  const tipoEquipos = data?.tipoEquipos;
  const subsedes = data?.subsedes;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fechaCompra');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const navigate = useNavigate();
  
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

  const handleSendToHojaDeVida = (row) => {
    // Redirige a la página de hoja de vida con el id del equipo, por ejemplo.
    navigate(`/hoja-de-vida/${row.serial}`);
  };

  const isSelected = (serial) => selected.indexOf(serial) !== -1;

  const filteredEquipos = equipos.filter(equipo =>
    equipo.marca.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.referencia.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.cuentaDante.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.tipoEquipo.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.subsede.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.serial.toLowerCase().includes(filter.toLowerCase()) ||
    equipo.placaSena.toLowerCase().includes(filter.toLowerCase()) ||
    new Date(equipo.fechaCompra).toLocaleDateString().includes(filter)
  );

  const sortedEquipos = stableSort(filteredEquipos, getComparator(order, orderBy));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedEquipos.length - page * rowsPerPage);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} marginTop={3} padding={3}>
        <Grid item xs={12}>
        <h1 className="text-center my-2 mb-3 text-xl font-semibold">Lista Equipos</h1>
          <TextField
            label="Buscar equipo"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            placeholder="Ej: Marca, cuentadante, referencia, subsede, serial, placaSena"
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
                                <TableCell>{row.subsede.nombre}</TableCell>
                                <TableCell>{row.estado ? "Activo" : "Inactivo" }</TableCell>                                
                                <TableCell padding="checkbox">
                                  <IconButton onClick={(event) => handleEditClick(event, row)}>
                                    {editMode === row.serial ? <SaveIcon /> : <EditIcon />}
                                  </IconButton>
                                  <IconButton onClick={() => handleSendToHojaDeVida(row)}>
                                    <FileSpreadsheet />
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
            <ImportButton />
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20]}
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
