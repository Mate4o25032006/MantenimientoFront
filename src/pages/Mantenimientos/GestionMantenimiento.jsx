"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/helpers/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function GestionMantenimiento() {
  
  const location = useLocation();
  const { mantenimientoId } = location.state || {};
  const [equipos, setEquipos] = useState([]);
  const [chequeos, setChequeos] = useState({});
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [equiposPerPage] = useState(3);
console.log(equipos);  
  const handleSeleccionarEquipo = (equipo) => {
    setEquipoSeleccionado(equipo);
    if (chequeos[equipo.serial]) {
      setObservaciones(chequeos[equipo.serial].observaciones);
    } else {
        setObservaciones("");
    }
  };
  
  const handleAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      iconColor: "#007BFF",
      showConfirmButton: false,
      timer: 2500,
      customClass: {
        container: "swal2-container",
        popup: "swal2-popup",
      },
    }).then(() => {
      navigate("/mantenimientos/lista", { replace: true });
    });
  };

  
  const filteredEquipos = useMemo(() => {
    return equipos.filter((equipo) => equipo.marca.toLowerCase().includes(busqueda.toLowerCase()));
  }, [equipos, busqueda]);

  const handleMarcarCompletado = async () => {
    try {
      const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/chequeos/addOrUpdate`, {
        equipoSerial: equipoSeleccionado.serial,
        mantenimientoId,
        descripcion: 'Completado',
        observaciones,
      });
      
      if (response.status === 200) {
        handleAlert('Éxito', 'Chequeo completado guardado correctamente', 'success');
        setEquipoSeleccionado(null); // Limpia la selección
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      handleAlert('Error', 'Error al guardar el chequeo', 'error');
    }
  };
  
  const indexOfLastEquipo = currentPage * equiposPerPage;
  const indexOfFirstEquipo = indexOfLastEquipo - equiposPerPage;
  const currentEquipos = filteredEquipos.slice(indexOfFirstEquipo, indexOfLastEquipo);

  const totalPages = Math.ceil(filteredEquipos.length / equiposPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/chequeos/addOrUpdate`, {
            equipoSerial: equipoSeleccionado.serial,
            mantenimientoId,
            descripcion: 'Fallas',
            observaciones,
        });

        if (response.status === 200) {
            handleAlert('Éxito', 'Chequeo de fallas guardado correctamente', 'success');
            setTareaSeleccionada(null); // Cierra el modal de observaciones
            setObservaciones(''); // Limpia las observaciones
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        handleAlert('Error', 'Error al guardar el chequeo', 'error');
    }
};

useEffect(() => {
  const fetchEquipos = async () => {
      try {
          const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/mantenimientos/${mantenimientoId}/equipos`);
          setEquipos(response.data);
      } catch (error) {
          console.error('Error al obtener los equipos relacionados:', error);
      }
  };

  const fetchChequeos = async () => {
      try {
          const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/chequeos/cosas/${mantenimientoId}`);
          const chequeosData = response.data;

          // Create a map of chequeos by equipo serial
          const chequeosMap = chequeosData.reduce((map, chequeo) => {
              map[chequeo.equipo.serial] = chequeo;
              return map;
          }, {});

          setChequeos(chequeosMap);
      } catch (error) {
          console.error('Error al obtener los chequeos relacionados:', error);
      }
  };

  if (mantenimientoId) {
      fetchEquipos();
      fetchChequeos();
  }
}, [mantenimientoId]);



  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">Gestión de Mantenimiento</h1>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="bg-background rounded-lg shadow-md p-6 w-100 h-auto">
        <h2 className="text-xl font-bold mb-4">Equipos</h2>
          <Input
            type="text"
            placeholder="Buscar equipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full mb-4"
          />
          <div className="grid gap-4">
            {currentEquipos.map((equipo) => (
              <div
                key={equipo.serial}
                className={`bg-card text-card-foreground rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted ${
                  equipoSeleccionado?.serial === equipo.serial ? "bg-muted" : ""
                }`}
                onClick={() => handleSeleccionarEquipo(equipo)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {equipo.marca}-{equipo.referencia}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      chequeos[equipo.serial]?.descripcion === "Fallas"
                      ? "bg-red-500 text-red-50"
                      : chequeos[equipo.serial]?.descripcion === "Completado"
                      ? "bg-green-500 text-green-50"
                      : "bg-gray-500 text-gray-50"
                    }`}
                  >
                    {chequeos[equipo.serial] ? chequeos[equipo.serial].descripcion : "Sin Chequeo"}
                  </span>
                </div>
                <div className="text-muted-foreground text-sm">
                  <p>Serial: {equipo.serial}</p>
                  <p>Tipo Equipo: {equipo.tipoEquipo.nombre}</p>
                  <p>Area: {equipo.subsede.nombre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {equipoSeleccionado && (
          <div className="bg-background rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Checklist de Mantenimiento - {equipoSeleccionado.referencia}  
            </h2>
            <div className="bg-card text-card-foreground rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Serial: {equipoSeleccionado.serial}</p>
                <p className="text-sm font-medium">Marca: {equipoSeleccionado.marca}</p>
                <p className="text-sm font-medium">Placa: {equipoSeleccionado.placaSena}</p>
                <p className="text-sm font-medium">Propietario: {equipoSeleccionado.cuentaDante.nombre}</p>
                <p className="text-sm font-medium">Observaciones: {observaciones}</p>  
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTareaSeleccionada(equipoSeleccionado.serial)}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Fallas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarcarCompletado}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Completado
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {tareaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Observaciones</h2>
            <Textarea
              placeholder="Ingrese las observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTareaSeleccionada(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Guardar</Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          disabled={currentPage === 1} 
          onClick={() => handlePageChange(currentPage - 1)}
          className="mx-2"
        >
          Anterior
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            variant="outline"
            className={`mx-1 ${currentPage === index + 1 ? 'bg-primary text-white' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button 
          variant="outline" 
          disabled={currentPage === totalPages} 
          onClick={() => handlePageChange(currentPage + 1)}
          className="mx-2"
        >
          Siguiente
        </Button>
      </div>

    </div>
 
  );
};