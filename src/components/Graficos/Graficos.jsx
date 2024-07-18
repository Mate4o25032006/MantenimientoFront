import React from 'react';
import MaintenanceHistoryChart from './HistoryChart';
import MaintenanceStatusChart from './TipoEquipoChart';
import AreaChart from './AreaChart'; // Suponiendo que tienes un tercer gráfico

export const Graficos = () => {
  return (
    <div style={styles.container}>
      <div style={styles.chartContainer}>
        <h2 style={{ fontWeight: 'bold'}}>Historial de Mantenimiento</h2>
        <div style={styles.chart}>
          <MaintenanceHistoryChart />
        </div>
      </div>
      <div style={styles.chartContainer}>
        <h2 style={{ fontWeight: 'bold'}}>Cantidad de equipos según el tipo</h2>
        <div style={styles.chart}>
          <MaintenanceStatusChart />
        </div>
      </div>
      <div style={styles.chartContainer}>
        <h2 style={{ fontWeight: 'bold'}}>Cantidad de equipos según la zona</h2>
        <div style={styles.chart}>
          <AreaChart />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: '20px',
  },
  chartContainer: {
    flex: '1 1 300px', // Permite que se expanda, pero tenga un mínimo de 300px
    margin: '10px',
    minWidth: '300px',
    maxWidth: '45%', // Ajusta según sea necesario
  },
  chart: {
    width: '90%',
    height: '300px',
  },
  '@media (max-width: 768px)': { // Breakpoint para pantallas pequeñas
    container: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    chartContainer: {
      maxWidth: '100%',
    },
  },
};

export default Graficos;