import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import useGetData from '@/hooks/useGetData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MaintenanceHistoryChart = () => {
  const { data, error, loading } = useGetData(['mantenimientos', 'equipos']); 
  console.log(data);
  
  const countCompletedAndFailed = (mantenimiento) => {
    let completedCount = 0;
    let withFailuresCount = 0;

    mantenimiento.chequeos.forEach(chequeo => {
        if (chequeo.descripcion === 'Completado') {
          completedCount++;
        } else if (chequeo.descripcion === 'Fallas') {
          withFailuresCount++;
        } 
      });

    return { completedCount, withFailuresCount };
  };

  const prepareChartData = () => {
    // Ordenar mantenimientos por FechaUltimoMantenimiento en orden descendente
    const sortedMantenimientos = data.mantenimientos.sort((a, b) => new Date(b.fechaUltimoMantenimiento) - new Date(a.fechaUltimoMantenimiento));
    
    // Tomar los últimos tres mantenimientos
    const latestMantenimientos = sortedMantenimientos.slice(0, 3);
    
    // Obtener etiquetas basadas en las fechas de los últimos tres mantenimientos
    const labels = latestMantenimientos.map(mant => mant.fechaUltimoMantenimiento);
    
    // Contar equipos completados y con fallas para los últimos tres mantenimientos
    const completedCounts = [];
    const failureCounts = [];

    latestMantenimientos.forEach(mant => {
      const { completedCount, withFailuresCount } = countCompletedAndFailed(mant);
      completedCounts.push(completedCount);
      failureCounts.push(withFailuresCount);
    });

    return {
      labels, 
      datasets: [
        {
          label: 'Completados',
          data: completedCounts,
          backgroundColor: '#007BFF',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Con Fallas',
          data: failureCounts,
          backgroundColor: '#90caf9',
          borderColor: '#64b5f6',
          borderWidth: 1,
        },
      ],
    };
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ajusta el paso del tick según tus datos
        },
      },
    },
  };

  if (loading) return <p>Cargando...</p>; 
  if (error) return <p>Error: {error}</p>; 

  return <Bar data={prepareChartData()} options={options} />;
};

export default MaintenanceHistoryChart;
