import React from 'react';
import { format } from 'date-fns';
import useGetData from '@/hooks/useGetData';

export const ExportButton = () => {
  const urls = ['mantenimientos'];
  const { data, error, loading } = useGetData(urls);

  const handleExport = async () => {
    if (!data || !data.mantenimientos || !Array.isArray(data.mantenimientos)) {
      console.error('Data is not in the expected format or is undefined');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hoja de Mantenimiento');

    // Configuración de columnas con encabezados y llaves
    worksheet.columns = [
      { header: 'Objetivo', key: 'objetivo', width: 20 },
      { header: 'Próxima Fecha de Mantenimiento', key: 'fechaProxMantenimiento', width: 25 },
      { header: 'Última Fecha de Mantenimiento', key: 'fechaUltimoMantenimiento', width: 25 },
      { header: 'Tipo de mantenimiento', key: 'tipoMantenimiento', width: 20 },
      { header: 'Técnico asignado', key: 'tecnico', width: 20 },
      { header: 'Serial Equipo', key: 'serial', width: 15 },
      { header: 'Placa SENA', key: 'placaSena', width: 15 },
      { header: 'Descripción del Chequeo', key: 'descripcionChequeo', width: 25 },
      { header: 'Observaciones', key: 'observaciones', width: 25 }
    ];

    // Transformar los datos para agregarlos al worksheet
    data.mantenimientos.flatMap(mantenimiento => 
      (mantenimiento.equipos || []).forEach(equipo => {
        const chequeo = mantenimiento.chequeos?.find(chq => chq.equipo.serial === equipo.serial);

        worksheet.addRow({
          objetivo: mantenimiento.objetivo,
          fechaProxMantenimiento: format(new Date(mantenimiento.fechaProxMantenimiento), 'dd/MM/yyyy'),
          fechaUltimoMantenimiento: format(new Date(mantenimiento.fechaUltimoMantenimiento), 'dd/MM/yyyy'),
          tipoMantenimiento: mantenimiento.tipoMantenimiento,
          tecnico: mantenimiento.usuario.nombre,
          serial: equipo.serial,
          placaSena: equipo.placaSena,
          descripcionChequeo: chequeo ? chequeo.descripcion : 'Pendiente',
          observaciones: chequeo ? chequeo.observaciones : ''
        });
      })
    );

    // Estilos para los encabezados
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' }
      };
      cell.border = {
        top: { style: 'medium', color: { argb: '000000' } },
        left: { style: 'medium', color: { argb: '000000' } },
        bottom: { style: 'medium', color: { argb: '000000' } },
        right: { style: 'medium', color: { argb: '000000' } }
      };
    });

    // Aplicar bordes a todas las celdas
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      });
    });

    // Aplicar filtros a todas las columnas
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.columns.length }
    };

    // Ajustar el ancho de las columnas automáticamente según el contenido
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength + 2;
    });

    // Crear un archivo y forzar la descarga
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mantenimientos.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>Error al obtener datos</p>
      ) : (
          <div className="flex justify-end">
            <button 
              onClick={handleExport} 
              className="bg-[#1565c0] text-white mt-2 font-semibold py-1 px-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-md"
            >
              Exportar
            </button>
          </div>
      )}
    </div>
  );
};

export default ExportButton;
