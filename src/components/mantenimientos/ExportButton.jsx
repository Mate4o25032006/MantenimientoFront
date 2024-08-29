import React from 'react';
import { format } from 'date-fns';
import useGetData from '@/hooks/useGetData';

export const ExportButton = () => {
  const urls = ['mantenimientos'];
  const { data, error, loading } = useGetData(urls);

  console.log(data);

  const handleExport = () => {
    // Asegúrate de que 'data' sea un objeto y tenga la propiedad 'mantenimientos'
    if (!data || !data.mantenimientos || !Array.isArray(data.mantenimientos)) {
      console.error('Data is not in the expected format or is undefined');
      return;
    }

    // Transformamos la data para incluir los detalles de los equipos
    const transformedData = data.mantenimientos.flatMap(mantenimiento => 
      (mantenimiento.equipos || []).map(equipo => ({
        // 'ID Mantenimiento': mantenimiento.idMantenimiento,
        'Objetivo': mantenimiento.objetivo,
        'Próxima Fecha de Mantenimiento': format(new Date(mantenimiento.fechaProxMantenimiento), 'dd/MM/yyyy'),
        'Última Fecha de Mantenimiento': format(new Date(mantenimiento.fechaUltimoMantenimiento), 'dd/MM/yyyy'),
        'Tipo de mantenimiento': mantenimiento.tipoMantenimiento,
        'Técnico asignado': mantenimiento.usuario.nombre,
        'Serial Equipo': equipo.serial,
        'Placa SENA': equipo.placaSena
      }))
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
