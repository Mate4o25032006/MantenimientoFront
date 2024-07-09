import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import useGetData from '../../hooks/useGetData';
import { Container, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';


function preventDefault(event) {
  event.preventDefault();
}

export const ListaUsuarios = () => {
  const { data, error, loading } = useGetData(["usuarios"]);
  const usuarios = data?.usuarios || [];

  useEffect(() => {
    if (loading) {
      console.log('Cargando datos...');
    } else if (error) {
      console.error('Error al obtener los datos:', error);
    } else {
      console.log('Datos obtenidos:', equipos);
    }
  }, [data, error, loading]);

  // Ordenar los equipos por fecha de compra en forma ascendente
  // const equiposOrdenados = equipos.sort((a, b) => new Date(a.fechaCompra) - new Date(b.fechaCompra));

//   // Limitar a 10 equipos
//   const equiposLimitados = equiposOrdenados.slice(0, 5);

const [searchTerm, setSearchTerm] = useState(''); // State to store the search term

  const filteredUsuario = usuarios.filter((usuario) => {
    const searchTextLower = searchTerm.toLowerCase();
    return (
      usuario.documento.toLowerCase().includes(searchTextLower) ||
      usuario.nombre.toLowerCase().includes(searchTextLower) ||
      usuario.correo.toLowerCase().includes(searchTextLower) ||
      (usuario.estado ? "Activo".toLowerCase() : "Inactivo".toLowerCase()).includes(searchTextLower)
    );
  });

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
            placeholder="Ej: Nombre, documento, correo"
            InputProps={{
                startAdornment: <SearchIcon style={{ color: '#1565c0', marginRight: 8 }} />,
              }}
        />
        </div>
          <TableContainer component={Paper} style={{ marginTop: 20, padding: 25 }} >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Documento</TableCell>
                  {/* <TableCell>Fecha Inicio</TableCell>
                  <TableCell>Fecha Fin</TableCell> */}
                  <TableCell>Nombre</TableCell> 
                  <TableCell>Correo</TableCell>
                  {/* <TableCell>Contraseña</TableCell> */}
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsuario.map((usuario) => (
                  <TableRow key={usuario.serial}>
                    {/* <TableCell>{new Date(usuario.fechaCompra).toLocaleDateString()}</TableCell> */}
                    <TableCell>{usuario.documento}</TableCell>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.correo}</TableCell>
                    <TableCell>{usuario.estado ? <ToggleOnIcon color='primary' /> : <ToggleOffIcon sx={{ fontSize: 30 }} color='primary' />}</TableCell>
                    <TableCell>
                        <Link>
                            <EditIcon sx={{ fontSize: 25 }} collor='primary'/>
                        </Link>
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
