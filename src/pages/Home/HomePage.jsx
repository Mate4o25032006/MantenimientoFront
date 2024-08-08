import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import EnhancedTable  from '../../components/home/Orders';
import useGetAdmin from '../../hooks/useGetAdmin';
import MaintenanceHistoryChart from '@/components/Graficos/HistoryChart';
import EquipmentTypeChart from '@/components/Graficos/TipoEquipoChart';
import AreaChart from '@/components/Graficos/AreaChart';
import { useMediaQuery } from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export const HomePage = () => {
  const admin1 = useGetAdmin();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <>
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
              }}
            >
            <Toolbar />
            <Container maxWidth="auto" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {/* Maintenance History Chart */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Historial de Mantenimiento</h2>
                    <MaintenanceHistoryChart />
                  </Paper>
                </Grid>
  
                {/* Equipment Type Chart */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Cantidad de equipos según el tipo</h2>
                    <div style={{ weight: '45%'}}>
                      <EquipmentTypeChart />
                    </div>
                  </Paper>
                </Grid>
  
                {/* Area Chart */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Cantidad de equipos según la zona</h2>
                    <div style={{ weight: '45%'}}>
                      <AreaChart />
                    </div>
                  </Paper>
                </Grid>
  
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <EnhancedTable />
                  </Paper>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
    </>
  );
};

export default HomePage;
