import React from 'react';
import { ExportToExcelButton } from 'react-export-excel';
import { format } from 'date-fns'; // Si necesitas formatear fechas
import useGetData from '@/hooks/useGetData';

export const ExportButton = () => {
  const urls = ['mantenimientos'];
  const { data, error, loading } = useGetData(urls);

  return (
    <div>
      {/* Resto de tu componente */}
      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>Error al obtener datos</p>
      ) : (
        <>
          {/* Resto de tu contenido */}
          <ExportToExcelButton
            filename="mantenimientos.xlsx"
            element={<button>Exportar Mantenimientos</button>}
          >
            <ExcelSheet data={data} name="Hoja de Mantenimiento">
              <ExcelColumn label="ID Mantenimiento" value="idMantenimiento" />
              <ExcelColumn
                label="Próxima Fecha de Mantenimiento"
                value={row => format(new Date(row.fechaProxMantenimiento), 'dd/MM/yyyy')}
              />
              <ExcelColumn label="Última Fecha de Mantenimiento" value="fechaUltimoMantenimiento" />
              <ExcelColumn label="Objetivo" value="objetivo" />
            </ExcelSheet>
          </ExportToExcelButton>
        </>
      )}
    </div>
  );
}