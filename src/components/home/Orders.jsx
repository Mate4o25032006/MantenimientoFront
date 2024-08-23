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
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

const headCells = [
  { id: 'fechaCompra', numeric: false, disablePadding: false, label: 'Fecha Compra' },
  { id: 'marca', numeric: false, disablePadding: false, label: 'Marca' },
  { id: 'referencia', numeric: false, disablePadding: false, label: 'Referencia' },
  { id: 'cuentaDante', numeric: false, disablePadding: false, label: 'Cuentadante' },
  { id: 'estado', numeric: false, disablePadding: false, label: 'Estado' },
];

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'cuentaDante') {
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


export default function EnhancedTable() {
  const { data, error, loading } = useGetData(["equipos"]);
  const equipos = data?.equipos || [];
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fechaCompra');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');

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
    new Date(equipo.fechaCompra).toLocaleDateString().includes(filter)
  );

  const sortedEquipos = stableSort(filteredEquipos, getComparator(order, orderBy));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedEquipos.length - page * rowsPerPage);

  return (
    <div>
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
        style={{ padding: '10px' }}
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
                  const isItemSelected = isSelected(row.serial);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.serial)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.serial}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row">
                        {new Date(row.fechaCompra).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{row.marca}</TableCell>
                      <TableCell>{row.referencia}</TableCell>
                      <TableCell>{row.cuentaDante.nombre}</TableCell>
                      <TableCell>{row.estado ? "Activo" : "Inactivo"}</TableCell>                                
                      </TableRow>
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          labelRowsPerPage="Número de filas"
          count={sortedEquipos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Cambiar estilo"
      />
    </div>
  );
}
