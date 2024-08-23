import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MaintenanceHistoryChart from '@/components/Graficos/HistoryChart';
import EquipmentTypeChart from '@/components/Graficos/TipoEquipoChart';
import EnhancedTable from '../../components/home/Orders';
import SubsedeChart from '@/components/Graficos/SubsedeChart';

// Componente para mostrar el aviso de copyright
const Copyright = (props) => (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {'Copyright © '}
    <Link color="inherit" href="https://mui.com/">
      Your Website
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

// Componente principal de la página de inicio
export const HomePage = () => {

  return (
    <Box
      component="main"
      sx={{
        // Estilo de fondo basado en el modo de color del tema
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh', // Altura completa de la ventana
        overflow: 'auto', // Permitir desplazamiento si el contenido es mayor que la ventana
      }}
    >
      <Toolbar /> {/* Espaciado superior para la barra de herramientas */}

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Gráfico de historial de mantenimiento */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', color:'#1565c0' }}>
                Historial de Mantenimiento
              </Typography>
              <MaintenanceHistoryChart />
            </Paper>
          </Grid>

          {/* Gráfico de cantidad de equipos según el tipo */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', color:'#1565c0' }}>
                Cantidad de equipos según el tipo
              </Typography>
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <EquipmentTypeChart />
              </Box>
            </Paper>
          </Grid>

          {/* Gráfico de cantidad de equipos según la zona */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', color:'#1565c0' }}>
                Cantidad de equipos según la subsede
              </Typography>
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <SubsedeChart />
              </Box>
            </Paper>
          </Grid>

          {/* Tabla de pedidos recientes */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <EnhancedTable />
            </Paper>
          </Grid>
        </Grid>

        {/* Componente de copyright al final de la página */}
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
};

