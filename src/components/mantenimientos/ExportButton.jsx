import React from 'react';
import { format } from 'date-fns';
import useGetData from '@/hooks/useGetData';

export const ExportButton = () => {
  const urls = ['mantenimientos'];
  const { data, error, loading } = useGetData(urls);

  const handleExport = () => {
    if (!data || !data.mantenimientos || !Array.isArray(data.mantenimientos)) {
      console.error('Data is not in the expected format or is undefined');
      return;
    }

    const transformedData = data.mantenimientos.flatMap(mantenimiento => 
      (mantenimiento.equipos || []).map(equipo => {
        const chequeo = mantenimiento.chequeos?.find(chq => chq.equipo.serial === equipo.serial);

        return {
          'Objetivo': mantenimiento.objetivo,
          'Próxima Fecha de Mantenimiento': format(new Date(mantenimiento.fechaProxMantenimiento), 'dd/MM/yyyy'),
          'Última Fecha de Mantenimiento': format(new Date(mantenimiento.fechaUltimoMantenimiento), 'dd/MM/yyyy'),
          'Tipo de mantenimiento': mantenimiento.tipoMantenimiento,
          'Técnico asignado': mantenimiento.usuario.nombre,
          'Serial Equipo': equipo.serial,
          'Placa SENA': equipo.placaSena,
          'Descripción del Chequeo': chequeo ? chequeo.descripcion : 'Pendiente', // Nueva columna con la descripción del chequeo
          'Observaciones': chequeo ? chequeo.observaciones : '' // Nueva columna con la descripción del chequeo
        };
      })
    );

    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja de Mantenimiento');
    XLSX.writeFile(wb, 'mantenimientos.xlsx');
  };

  return (
    <div>
      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>Error al obtener datos</p>
      ) : (
        <button onClick={handleExport}>Exportar Mantenimientos</button>
      )}
    </div>
  );
};
