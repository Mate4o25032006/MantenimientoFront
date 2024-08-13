import { useEffect, useState } from 'react'; // Importación de hooks y componentes de React
import Table from '@mui/material/Table'; // Importación de componentes de Material UI para la tabla
import TableBody from '@mui/material/TableBody'; 
import TableCell from '@mui/material/TableCell'; 
import TableContainer from '@mui/material/TableContainer'; 
import TableHead from '@mui/material/TableHead'; 
import TableRow from '@mui/material/TableRow'; 
import Paper from '@mui/material/Paper'; 
import Grid from '@mui/material/Grid'; 
import useGetData from '../../hooks/useGetData'; // Hook personalizado para obtener datos
import { Button, Container, TextField } from '@mui/material'; // Componentes de Material UI para diseño y formulario
import SearchIcon from '@mui/icons-material/Search'; // Icono para búsqueda
import { useNavigate } from 'react-router-dom'; // Hook para la navegación

// Función para prevenir el comportamiento por defecto de un evento
function preventDefault(event) {
  event.preventDefault();
}

// Componente principal de la lista de mantenimientos
export const ListaMantenimientos = () => {
  // Uso del hook personalizado para obtener los datos de mantenimientos
  const { data, error, loading } = useGetData(["mantenimientos"]);
  const navigate = useNavigate(); // Hook para la navegación entre rutas
  const mantenimiento = data?.mantenimientos || []; // Datos de mantenimientos, o un array vacío si no hay datos

  // Hook useEffect para manejar el estado de carga y errores
  useEffect(() => {
    if (loading) {
      console.log('Cargando datos...'); // Mensaje de carga
    } else if (error) {
      console.error('Error al obtener los datos:', error); // Mensaje de error
    } else {
      console.log('Datos obtenidos:', mantenimiento); // Mensaje con los datos obtenidos
    }
  }, [data, error, loading]); // Dependencias del efecto

  // Estado para almacenar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra los mantenimientos basados en el término de búsqueda
  const filteredMantent = mantenimiento.filter((mant) => {
    const searchTextLower = searchTerm.toLowerCase();
    return (
      mant.objetivo.toLowerCase().includes(searchTextLower) ||
      mant.tipoMantenimiento.toLowerCase().includes(searchTextLower) ||
      mant.usuario.nombre.toLowerCase().includes(searchTextLower) ||
      (mant.estado ? "Activo".toLowerCase() : "Inactivo".toLowerCase()).includes(searchTextLower)
    );
  });

  // Función para manejar la visualización de la gestión de mantenimiento
  const handleViewGestion = (mant) => {
    navigate(`/mantenimientos/${mant.idMantenimiento}/equipos`, { state: { mantenimientoId: mant.idMantenimiento } });
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
              onChange={(event) => setSearchTerm(event.target.value)} // Actualiza el término de búsqueda
              fullWidth
              placeholder="Ej: Marca, propietario, referencia"
              InputProps={{
                startAdornment: <SearchIcon style={{ color: '#1565c0', marginRight: 8 }} />, // Icono de búsqueda
              }}
            />
          </div>
          <TableContainer component={Paper} style={{ marginTop: 20, padding: 25 }}>
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
