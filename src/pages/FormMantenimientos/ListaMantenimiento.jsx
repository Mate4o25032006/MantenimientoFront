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
import { Button, Container, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function preventDefault(event) {
  event.preventDefault();
}

export const ListaMantenimientos = () => {
  const { data, error, loading } = useGetData(["mantenimientos"]);
  const navigate = useNavigate();  // Utiliza useNavigate aquí
  const mantenimiento = data?.mantenimientos || [];

  useEffect(() => {
    if (loading) {
      console.log('Cargando datos...');
    } else if (error) {
      console.error('Error al obtener los datos:', error);
    } else {
      console.log('Datos obtenidos:', mantenimiento);
    }
  }, [data, error, loading]);
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search term

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
    navigate('/mantenimientos/${idMantenimiento}/equipos', { state: { mantenimientoId: mant.idMantenimiento } });
  };

  return (
    <Container maxWidth="lg" >
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
          <TableContainer component={Paper} style={{ marginTop: 20, padding: 25 }} >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha Prox Mantenimiento</TableCell>
                  <TableCell>Fecha Ultimo Mantenimiento</TableCell>
                  <TableCell>Objetivo</TableCell>
                  <TableCell>Tipo de Mantenimiento</TableCell>
                  <TableCell>Responsable</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {filteredMantent.map((mant) => (
                <TableRow key={mant.idMantenimiento}>
                  <TableCell>{new Date(mant.fechaProxMantenimiento).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(mant.fechaUltimoMantenimiento).toLocaleDateString()}</TableCell>
                  <TableCell>{mant.objetivo}</TableCell>
                  <TableCell>{mant.tipoMantenimiento}</TableCell>
                  <TableCell>{mant.usuario.nombre}</TableCell>
                  <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleViewGestion(mant)}>
                        Ver Gestión
                      </Button>
                    </TableCell>
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
