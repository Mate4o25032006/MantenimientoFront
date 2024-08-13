import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/helpers/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Componente principal para la gestión de mantenimiento
export function GestionMantenimiento() {
  // Obtiene la ubicación actual y extrae el ID de mantenimiento de los parámetros de estado
  const location = useLocation();
  const { mantenimientoId } = location.state || {};

  // Estados locales para manejar los datos del componente
  const [equipos, setEquipos] = useState([]); // Lista de equipos asociados al mantenimiento
  const [chequeos, setChequeos] = useState({}); // Chequeos realizados a los equipos
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null); // Equipo seleccionado por el usuario
  const [busqueda, setBusqueda] = useState(""); // Texto de búsqueda para filtrar equipos
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null); // Tarea seleccionada para agregar observaciones
  const [observaciones, setObservaciones] = useState(""); // Observaciones del equipo seleccionado
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual de la lista de equipos
  const [elementosPorPagina] = useState(3); // Número de elementos mostrados por página
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Maneja la selección de un equipo por parte del usuario
  const handleSeleccionarEquipo = (equipo) => {
    setEquipoSeleccionado(equipo); // Establece el equipo seleccionado
    setObservaciones(chequeos[equipo.serial]?.observaciones || ""); // Carga las observaciones previas si existen
  };

  // Muestra una alerta personalizada con SweetAlert2
  const handleAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      iconColor: "#007BFF", // Color personalizado del ícono
      showConfirmButton: false, // No mostrar botón de confirmación
      timer: 2500, // Duración de la alerta
      customClass: {
        container: "swal2-container",
        popup: "swal2-popup",
      },
    }).then(() => {
      // Redirige a la lista de mantenimientos después de la alerta
      navigate("/mantenimientos/lista", { replace: true });
    });
  };

  // Filtra los equipos en función del texto de búsqueda
  const filteredEquipos = useMemo(() => {
    return equipos.filter((equipo) =>
      equipo.marca.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [equipos, busqueda]);

  // Cálculo de los índices de los equipos a mostrar en la página actual
  const indexOfLastEquipo = paginaActual * elementosPorPagina;
  const indexOfFirstEquipo = indexOfLastEquipo - elementosPorPagina;
  const equiposPaginaActual = filteredEquipos.slice(indexOfFirstEquipo, indexOfLastEquipo);

  // Maneja la acción de marcar un equipo como completado
  const handleMarcarCompletado = async () => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/chequeos/addOrUpdate`,
        {
          equipoSerial: equipoSeleccionado.serial,
          mantenimientoId,
          descripcion: 'Completado', // Descripción del chequeo
          observaciones, // Observaciones actuales
        }
      );

      if (response.status === 200) {
        handleAlert('Éxito', 'Chequeo completado guardado correctamente', 'success');
        setEquipoSeleccionado(null); // Limpia la selección del equipo
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      handleAlert('Error', 'Error al guardar el chequeo', 'error');
    }
  };

  // Maneja el envío del formulario para marcar un equipo con fallas
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/chequeos/addOrUpdate`,
        {
          equipoSerial: equipoSeleccionado.serial,
          mantenimientoId,
          descripcion: 'Fallas', // Descripción del chequeo
          observaciones, // Observaciones actuales
        }
      );

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

  // Hook para obtener los equipos y chequeos relacionados cuando se carga el componente
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_API_URL}/mantenimientos/${mantenimientoId}/equipos`
        );
        setEquipos(response.data); // Establece los equipos en el estado
      } catch (error) {
        console.error('Error al obtener los equipos relacionados:', error);
      }
    };

    const fetchChequeos = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_API_URL}/chequeos/cosas/${mantenimientoId}`
        );
        const chequeosData = response.data;

        // Mapea los chequeos en un objeto con el serial del equipo como clave
        const chequeosMap = chequeosData.reduce((map, chequeo) => {
          map[chequeo.equipo.serial] = chequeo;
          return map;
        }, {});

        setChequeos(chequeosMap); // Establece los chequeos en el estado
      } catch (error) {
        console.error('Error al obtener los chequeos relacionados:', error);
      }
    };

    // Si hay un ID de mantenimiento, se obtienen los equipos y chequeos
    if (mantenimientoId) {
      fetchEquipos();
      fetchChequeos();
    }
  }, [mantenimientoId]);

  // Manejadores para cambiar de página en la lista de equipos
  const handlePaginaSiguiente = () => {
    if (paginaActual < Math.ceil(filteredEquipos.length / elementosPorPagina)) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

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
            onChange={(e) => setBusqueda(e.target.value)} // Actualiza el estado de búsqueda
            className="w-full mb-4"
          />
          <div className="grid gap-4">
            {equiposPaginaActual.map((equipo) => (
              <div
                key={equipo.serial}
                className={`bg-card text-card-foreground rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted ${
                  equipoSeleccionado?.serial === equipo.serial ? "bg-muted" : ""
                }`}
                onClick={() => handleSeleccionarEquipo(equipo)} // Maneja la selección del equipo
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
                    {chequeos[equipo.serial]?.descripcion || "Sin Chequeo"}
                  </span>
                </div>
                <div className="text-muted-foreground text-sm">
                  <p>Serial: {equipo.serial}</p>
                  <p>Tipo Equipo: {equipo.tipoEquipo.nombre}</p>
                  <p>Área: {equipo.area.zona}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePaginaAnterior} // Cambia a la página anterior
              disabled={paginaActual === 1} // Deshabilita si es la primera página
              className="bg-blue-700 text-white hover:bg-blue-800"
            >
              Anterior
            </Button>
            <Button
              onClick={handlePaginaSiguiente} // Cambia a la página siguiente
              disabled={paginaActual === Math.ceil(filteredEquipos.length / elementosPorPagina)} // Deshabilita si es la última página
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Siguiente
            </Button>
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
                  onClick={() => setTareaSeleccionada(equipoSeleccionado.serial)} // Abre el modal para agregar observaciones
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Fallas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarcarCompletado} // Marca el equipo como completado
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
              onChange={(e) => setObservaciones(e.target.value)} // Actualiza las observaciones
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
    </div>
  );
}
