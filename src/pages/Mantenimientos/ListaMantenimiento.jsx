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
import { ExportButton } from '@/components/mantenimientos/ExportButton';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
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
    return { completedChequeos, totalEquipos };
  };  

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} marginTop={2} padding={3}>
        <Grid item xs={12}>
        <h1 className="text-center my-2 mb-3 text-xl font-semibold">Lista Mantenimientos</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          <TableContainer component={Paper} style={{ marginTop: 1, padding: 25 }}>
          <ExportButton />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Fecha Prox Mantenimiento</StyledTableCell>
                  <StyledTableCell>Fecha Ultimo Mantenimiento</StyledTableCell>
                  <StyledTableCell>Objetivo</StyledTableCell>
                  <StyledTableCell>Tipo de Mantenimiento</StyledTableCell>
                  <StyledTableCell>Técnico asignado</StyledTableCell>
                  <StyledTableCell>Progreso (Equipos Completados)</StyledTableCell>
                  <StyledTableCell>Acciones</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMantent.map((mant) => {
                  const { completedChequeos, totalEquipos } = calculateProgress(mant.equipos, mant.chequeos);
                  const progressValue = totalEquipos > 0 ? (completedChequeos / totalEquipos) * 100 : 0;
                  return (
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
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <LinearProgress variant="determinate" value={progressValue} style={{ width: '100%', marginBottom: 8 }} />
                            <Typography variant="caption">
                              {`${completedChequeos} de ${totalEquipos}`}
                            </Typography>
                            </Box>
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListaMantenimientos;
