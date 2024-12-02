// EquipmentSheet.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/helpers/axiosConfig';
import './EquipmentSheet.css';
import { useParams } from 'react-router-dom';
import DownloadPDF from './DownloadPDF';

const EquipmentSheet = () => {
  const { serial } = useParams();
  const [equipmentData, setEquipmentData] = useState(null);

  useEffect(() => {
    axiosInstance.get(`${import.meta.env.VITE_API_URL}/equipos/equiposCV/${serial}`)
      .then(response => {
        setEquipmentData(response.data);
      })
      .catch(error => {
        console.error('Error fetching equipment data', error);
      });
  }, [serial]);

  if (!equipmentData) return <div>Loading...</div>;

  console.log(equipmentData)

  return (
    <div className="equipment-sheet-container">
      <DownloadPDF equipmentData={equipmentData} />
      <div id="equipment-sheet">
        <table className="equipment-sheet-table">
          <thead>
            <tr>
              <th colSpan="5" className="equipment-sheet-header">HOJA DE VIDA EQUIPO</th>
            </tr>
            <tr>
              <th rowSpan="4" className="equipment-sheet-image-header">IMAGEN</th>
              <th colSpan="4">INFORMACIÓN UBICACIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan="8" className="equipment-sheet-image">
                <a
                  href={equipmentData.equipo.imagenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#4A90E2',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: '1px solid #4A90E2',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#E5F6FD')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  Ver Evidencia
                </a>              
              </td>
              <td className="equipment-sheet-title">Centro de formación</td>
              <td colSpan="3">Centro de la Innovación, la Agroindustria y la Aviación - CIAA</td>
            </tr>
            <tr>
              <td className="equipment-sheet-title">Sede</td>
              <td colSpan="3">{equipmentData.equipo.subsede.nombre || 'N/A'}</td>
            </tr>
            <tr>
              <td className="equipment-sheet-title">Dependencia</td>
              <td colSpan="3">{equipmentData.equipo.dependencia.nombre || 'N/A'}</td>
            </tr>
            <tr>
              <td className="equipment-sheet-title">Ambiente</td>
              <td colSpan="3">{equipmentData.equipo.ambiente.nombre || 'N/A'}</td>
            </tr>
            <tr>
              <th colSpan="4">INFORMACIÓN DEL EQUIPO</th>
            </tr>
            <tr className="equipment-info-row">
              <td className="equipment-sheet-title">Tipo de Equipo</td>
              <td>{equipmentData.equipo.tipoEquipo.nombre}</td>
              <td className="equipment-sheet-title">Marca</td>
              <td>{equipmentData.equipo.marca}</td>
            </tr>
            <tr className="equipment-info-row">
              <td className="equipment-sheet-title">Referencia</td>
              <td>{equipmentData.equipo.referencia}</td>
              <td className="equipment-sheet-title">Serial</td>
              <td>{equipmentData.equipo.serial}</td>
            </tr>
          </tbody>
        </table>

        <table className="equipment-sheet-table">
          <thead>
            <tr>
              <th colSpan="4">INFORMACIÓN INTERNA SENA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold">Cuentadante</td>
              <td>{equipmentData.equipo.cuentaDante.nombre}</td>
              <td className="font-bold">Documento Cuentadante</td>
              <td>{equipmentData.equipo.cuentaDante.documento}</td>
            </tr>
            <tr>
              <td className="font-bold">Placa SENA</td>
              <td>{equipmentData.equipo.placaSena}</td>
              <td className="font-bold">Fecha de adquisición</td>
              <td>{equipmentData.equipo.fechaCompra}</td>
            </tr>
          </tbody>
        </table>

        <table className="equipment-sheet-table">
          <thead>
            <tr>
              <th colSpan="6">HISTORIAL DE MANTENIMIENTO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Fecha</th>
              <th>Objetivo</th>
              <th>Tipo de Mantenimiento</th>
              <th>Responsable</th>
              <th>Chequeo</th>
              <th>Link Evidencia</th>
            </tr>
            {equipmentData.equipo.mantenimientos?.map((mantenimiento, index) => {
              // Busca un chequeo que coincida con el id del mantenimiento actual
              const chequeoRelacionado = equipmentData.equipo?.chequeos?.find(
                (chequeo) => chequeo.mantenimiento.idMantenimiento === mantenimiento.idMantenimiento
              );

              return (
                <tr key={index}>
                  <td>{mantenimiento.fechaUltimoMantenimiento}</td>
                  <td>{mantenimiento.objetivo}</td>
                  <td>{mantenimiento.tipoMantenimiento}</td>
                  <td>{mantenimiento.usuario.nombre}</td>
                  <td>{chequeoRelacionado.descripcion}</td>
                  <td>
                    {chequeoRelacionado ? (
                      <a
                        href={chequeoRelacionado.linkEvidencia}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#4A90E2',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          border: '1px solid #4A90E2',
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#E5F6FD')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                      >
                        Ver Evidencia
                      </a>
                    ) : (
                      "No hay evidencia"
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default EquipmentSheet;
