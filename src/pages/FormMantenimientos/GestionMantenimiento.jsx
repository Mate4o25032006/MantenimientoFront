import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useGetData from "@/hooks/useGetData";
import usePostData from "@/hooks/usePostData";
import axiosInstance from "@/helpers/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function GestionMantenimiento() {
  const location = useLocation();
  const { mantenimientoId } = location.state || {};
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/mantenimientos/${mantenimientoId}/equipos`);
        setEquipos(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error al obtener los equipos relacionados:", error);
      }
    };

    if (mantenimientoId) {
      fetchEquipos();
    }
  }, [mantenimientoId]);

  const handleSeleccionarEquipo = (equipo) => {
    setEquipoSeleccionado(equipo);
  };

  const handleMarcarFalla = (equipoId) => {
    setTareaSeleccionada(equipoId);
  };

  const handleMarcarCompletado = (equipoId) => {
    setEquipos((prevEquipos) => {
      return prevEquipos.map((equipo) => {
        if (equipo.id === equipoId) {
          return { ...equipo, estado: { idEstado: equipo.estado.idEstado, estado: "En uso" } }; 
        }
        return equipo;
      });
    });
    setTareaSeleccionada(null);
    setObservaciones("");
  };

  const filteredEquipos = equipos.filter((equipo) => {
    return equipo.marca && equipo.marca.toLowerCase().includes(busqueda.toLowerCase());
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataChequeo = {
      equipo_serial: equipoSeleccionado.serial,
      observaciones,
      descripcion: "Proceso",
    };

    try {
      await axiosInstance.post(`${import.meta.env.VITE_API_URL}/chequeos`, dataChequeo);
      Swal.fire({
        title: "¡Bien!",
        text: "La información ha sido guardada correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        customClass: {
            container: 'swal2-container', 
            popup: 'swal2-popup' 
        }
    }).then(() => {
        navigate("/admin", { replace: true });
    });
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  if (!mantenimientoId) {
    return <div>Error: No se proporcionó el ID del mantenimiento.</div>;
  }

  console.log(filteredEquipos);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">Gestión de Mantenimiento</h1>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Equipos</h2>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Buscar equipo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid gap-4">
            {filteredEquipos.map((equipo) => (
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
                </div>
                <div className="text-muted-foreground text-sm">
                  <p>Serial: {equipo.serial}</p>
                  <p>Tipo Equipo: {equipo.tipoEquipo.nombre}</p>
                  <p>Area: {equipo.area.zona}</p> 
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
            <div className=" grid gap-4">
              <div className="bg-card text-card-foreground rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    Serial: {equipoSeleccionado.serial}
                  </p>
                  <p className="text-sm font-medium">
                    Marca: {equipoSeleccionado.marca}
                  </p>
                  <p className="text-sm font-medium">
                    Placa: {equipoSeleccionado.placaSena}
                  </p>
                  <p className="text-sm font-medium">
                    Propietario: {equipoSeleccionado.cuentaDante.nombre}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarcarFalla(equipoSeleccionado.serial)}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Fallas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarcarCompletado(equipoSeleccionado.serial)}
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    Completado
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {tareaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 ">
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
    </div>
  );
}
