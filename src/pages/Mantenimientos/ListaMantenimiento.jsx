import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import useGetData from '../../hooks/useGetData';
import { IconButton, Container, TextField, LinearProgress, Box, Typography, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import usePutData from '../../hooks/usePutData';
import { Select } from '@/components/forms/elements/select';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200], // Fondo gris claro
  color: '#1565c0',
  fontWeight: 'bold',
}));

export const ListaMantenimientos = () => {
  const { data, error, loading } = useGetData(["mantenimientos", "usuarios"]);
  const navigate = useNavigate();
  const mantenimiento = data?.mantenimientos || [];
  const [editMode, setEditMode] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  
  const handlePutData = usePutData(`mantenimientos`, () => {
    setEditMode(null);
  });

  useEffect(() => {
    if (loading) {
      console.log('Cargando datos...');
    } else if (error) {
      console.error('Error al obtener los datos:', error);
    } else {
      console.log('Datos obtenidos:', mantenimiento);
    }
  }, [data, error, loading]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMantent = mantenimiento.filter((mant) => {
    const searchTextLower = searchTerm.toLowerCase();
    return (
      mant.objetivo.toLowerCase().includes(searchTextLower) ||
      mant.tipoMantenimiento.toLowerCase().includes(searchTextLower) ||
      mant.usuario.nombre.toLowerCase().includes(searchTextLower) ||
      (mant.estado ? "Activo".toLowerCase() : "Inactivo".toLowerCase()).includes(searchTextLower)
    );
  });

  const handleViewGestion = (mant) => {
    navigate(`/mantenimientos/${mant.idMantenimiento}/equipos`, { state: { mantenimientoId: mant.idMantenimiento } });
  };

  const handleEditClick = (event, row) => {
    if (editMode === row.idMantenimiento) {
      console.log('Updating:', editedRow);
      handlePutData(editedRow);
    } else {
      setEditMode(row.idMantenimiento);
      setEditedRow(row);
    }
  };

  const handleInputChange = (event, field) => {
    const value = event.target.value;
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  const calculateProgress = (equipos, chequeos) => {
    const totalEquipos = equipos.length;
    const completedChequeos = chequeos.filter(chequeo => chequeo.descripcion === "Completado").length;
    return totalEquipos > 0 ? (completedChequeos / totalEquipos) * 100 : 0;
  };  

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} marginTop={10} padding={3}>
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
            <TextField
              id="search-equipo"
              label="Buscar equipo"
              variant="outlined"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              fullWidth
              placeholder="Ej: Marca, propietario, referencia"
              InputProps={{
                startAdornment: <SearchIcon style={{ color: '#1565c0', marginRight: 8 }} />,
              }}
            />
          </div>
          <TableContainer component={Paper} style={{ marginTop: 20, padding: 25 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Fecha Prox Mantenimiento</StyledTableCell>
                  <StyledTableCell>Fecha Ultimo Mantenimiento</StyledTableCell>
                  <StyledTableCell>Objetivo</StyledTableCell>
                  <StyledTableCell>Tipo de Mantenimiento</StyledTableCell>
                  <StyledTableCell>Técnico asignado</StyledTableCell>
                  <StyledTableCell>Progreso (Equipos Completados)</StyledTableCell> {/* Nueva columna para el progreso */}
                  <StyledTableCell>Acciones</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMantent.map((mant) => (
                  <TableRow key={mant.idMantenimiento}>
                    {editMode === mant.idMantenimiento ? (
                      <>
                        <TableCell>
                          <TextField
                            value={editedRow.fechaProxMantenimiento || ''}
                            onChange={(event) => handleInputChange(event, 'fechaProxMantenimiento')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={editedRow.fechaUltimoMantenimiento || ''}
                            onChange={(event) => handleInputChange(event, 'fechaUltimoMantenimiento')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={editedRow.objetivo || ''}
                            onChange={(event) => handleInputChange(event, 'objetivo')}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            name="tipoMantenimiento"
                            onChange={(event) => handleInputChange(event, 'tipoMantenimiento')}
                            value={editedRow.tipoMantenimiento}
                            style={{ height: '60px' }}
                            options={[
                              { value: "Correctivo", label: "Correctivo" },
                              { value: "Preventivo", label: "Preventivo" },
                              { value: "Predictivo", label: "Predictivo" },
                            ]}
                          />
                        </TableCell>
                        <Select
                          name="usuario"
                          value={editedRow.usuario ? editedRow.usuario.documento : ''}
                          onChange={(event) => handleInputChange(event, 'usuario')}
                          options={data.usuarios.map(usuario => ({ value: usuario.documento, label: usuario.nombre }))}
                          style={{ height: '60px', marginTop: '6px' }}
                        />
                        <TableCell>
                          <IconButton onClick={(event) => handleEditClick(event, mant)}>
                            <SaveIcon color='primary'/>
                          </IconButton>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{new Date(mant.fechaProxMantenimiento).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(mant.fechaUltimoMantenimiento).toLocaleDateString()}</TableCell>
                        <TableCell>{mant.objetivo}</TableCell>
                        <TableCell>{mant.tipoMantenimiento}</TableCell>
                        <TableCell>{mant.usuario.nombre}</TableCell>
                        <TableCell>
                          <LinearProgress variant="determinate" value={calculateProgress(mant.equipos, mant.chequeos)} />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleEditClick(event, mant)}>
                            <EditIcon color='primary'/>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          {mant.equipos && mant.equipos.length > 0 && (
                            <IconButton onClick={() => handleViewGestion(mant)}>
                              <VisibilityIcon color="primary" />
                            </IconButton>
                          )}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListaMantenimientos;
