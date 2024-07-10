import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import useGetData from '../../hooks/useGetData';


function preventDefault(event) {
  event.preventDefault();
}

export const Orders = () => {
  const { data, error, loading } = useGetData(["equipos"]);
  const equipos = data?.equipos || [];

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
  const equiposOrdenados = equipos.sort((a, b) => new Date(a.fechaCompra) - new Date(b.fechaCompra));

  // Limitar a 10 equipos
  const equiposLimitados = equiposOrdenados.slice(0, 5);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha Compra</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Referencia</TableCell>
                <TableCell>Cuentadante</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equiposLimitados.map((equipo) => (
                <TableRow key={equipo.serial}>
                  <TableCell>{new Date(equipo.fechaCompra).toLocaleDateString()}</TableCell>
                  <TableCell>{equipo.marca}</TableCell>
                  <TableCell>{equipo.referencia}</TableCell>
                  <TableCell>{equipo.cuentaDante.nombre}</TableCell>
                  <TableCell>{equipo.estado ? "Activo" : "Inactivo"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
