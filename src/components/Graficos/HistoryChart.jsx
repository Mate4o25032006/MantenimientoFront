import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import useGetData from '@/hooks/useGetData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MaintenanceHistoryChart = () => {
  const { data, error, loading } = useGetData(['mantenimientos']); 
  console.log(data);

  // Función para procesar los datos y contar equipos completados y con fallas
  const countCompletedAndFailed = () => {
    let completedCount = 0;
    let withFailuresCount = 0;

    data.mantenimientos.forEach(mant => {
      mant.equipos.forEach(equipo => {
        equipo.chequeos.forEach(chequeo => {
          if (chequeo.descripcion === 'Completado') {
            completedCount++;
          } else if (chequeo.descripcion === 'Proceso') {
            withFailuresCount++;
          }
        });
      });
    });

    return { completedCount, withFailuresCount };
  };

  const prepareChartData = () => {
    const { completedCount, withFailuresCount } = countCompletedAndFailed();

    return {
      labels: ['Equipos'], // Puedes ajustar las etiquetas según tus necesidades
      datasets: [
        {
          label: 'Completados',
          data: [completedCount],
          backgroundColor: '#007BFF',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Con Fallas',
          data: [withFailuresCount],
          backgroundColor: '#FF5733',
          borderColor: 'rgba(255, 87, 51, 1)',
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

  if (loading) return <p>Cargando...</p>; // Manejar el estado de carga si es necesario
  if (error) return <p>Error: {error}</p>; // Manejar el estado de error si es necesario

  return <Bar data={prepareChartData()} options={options} />;
};

export default MaintenanceHistoryChart;
