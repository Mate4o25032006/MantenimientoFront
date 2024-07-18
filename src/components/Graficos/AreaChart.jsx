import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import useGetData from '@/hooks/useGetData';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

// Definir una gama de colores entre azul y morado
const colors = [
    '#e3f2fd', // 50
    '#1e88e5', // 600
    '#64b5f6', // 300
    '#0d47a1', // 900
    '#82b1ff', // A100
    '#42a5f5', // 400
    '#2962ff', // A700
    '#448aff', // A200
    '#90caf9', // 200
    '#2979ff', // A400
    '#bbdefb', // 100
    '#2196f3', // 500
    '#1976d2', // 700
    '#1565c0', // 800
  ];

const AreaChart = () => {
  const { data, error, loading } = useGetData(['equipos']);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Cantidad de Equipos',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (!loading && !error && data.equipos) {
      const tipoCounts = data.equipos.reduce((acc, equipo) => {
        acc[equipo.area.zona] = (acc[equipo.area.zona] || 0) + 1;
        return acc;
      }, {});

      const tipos = Object.keys(tipoCounts);
      const cantidades = Object.values(tipoCounts);
      const backgroundColors = tipos.map((_, index) => colors[index % colors.length]);
      const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));

      setChartData({
        labels: tipos,
        datasets: [
          {
            label: 'Cantidad de Equipos',
            data: cantidades,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      });
    }
  }, [loading, error, data]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <Pie data={chartData} />;
};

export default AreaChart;
