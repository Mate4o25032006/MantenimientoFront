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
  const [observaciones, setObservaciones] = useState("");
  const [linkEvidencia, setLinkEvidencia] = useState("");
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null); // Estado para abrir la modal
  const [tipoChequeo, setTipoChequeo] = useState(""); // Nuevo estado para determinar si es "Fallas" o "Completado"
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [equiposPerPage] = useState(3);

  const handleSeleccionarEquipo = (equipo) => {
    setEquipoSeleccionado(equipo);
    if (chequeos[equipo.serial]) {
      setObservaciones(chequeos[equipo.serial].observaciones);
      setLinkEvidencia(chequeos[equipo.serial].linkEvidencia || "");
    } else {
      setObservaciones("");
      setLinkEvidencia("");
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
    return equipos.filter((equipo) =>
    equipo.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
    equipo.serial.toLowerCase().includes(busqueda.toLowerCase()) ||
    equipo.placaSena.toLowerCase().includes(busqueda.toLowerCase()) ||
    equipo.referencia.toLowerCase().includes(busqueda.toLowerCase()) ||
    equipo.tipoEquipo.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [equipos, busqueda]);

  // Unificar lógica para abrir la modal con la descripción correspondiente
  const handleOpenModal = (tipo) => {
    setTipoChequeo(tipo); // "Fallas" o "Completado"
    setTareaSeleccionada(equipoSeleccionado.serial);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/chequeos/addOrUpdate`,
        {
          equipoSerial: equipoSeleccionado.serial,
          mantenimientoId,
          descripcion: tipoChequeo, // Aquí diferenciamos entre "Fallas" o "Completado"
          observaciones,
          linkEvidencia,
        }
      );

      if (response.status === 200) {
        handleAlert(
          "Éxito",
          `Chequeo de ${tipoChequeo} guardado correctamente`,
          "success"
        );
        setTareaSeleccionada(null); // Cierra el modal de observaciones
        setObservaciones(""); // Limpia las observaciones
        setLinkEvidencia(""); // Limpia el link
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      handleAlert("Error", "Error al guardar el chequeo", "error");
    }
  };

  const indexOfLastEquipo = currentPage * equiposPerPage;
  const indexOfFirstEquipo = indexOfLastEquipo - equiposPerPage;
  const currentEquipos = filteredEquipos.slice(
    indexOfFirstEquipo,
    indexOfLastEquipo
  );

  const totalPages = Math.ceil(filteredEquipos.length / equiposPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_API_URL}/mantenimientos/${mantenimientoId}/equipos`
        );
        setEquipos(response.data);
      } catch (error) {
        console.error("Error al obtener los equipos relacionados:", error);
      }
    };

    const fetchChequeos = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_API_URL}/chequeos/cosas/${mantenimientoId}`
        );
        const chequeosData = response.data;

        const chequeosMap = chequeosData.reduce((map, chequeo) => {
          map[chequeo.equipo.serial] = chequeo;
          return map;
        }, {});

        setChequeos(chequeosMap);
      } catch (error) {
        console.error("Error al obtener los chequeos relacionados:", error);
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
                    {equipo.marca} - {equipo.referencia}
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
                    {chequeos[equipo.serial]
                      ? chequeos[equipo.serial].descripcion
                      : "Sin Chequeo"}
                  </span>
                </div>
                <div className="text-muted-foreground text-sm">
                  <p>Serial: {equipo.serial}</p>
                  <p>PlacaSena: {equipo.placaSena}</p>
                  <p>Tipo Equipo: {equipo.tipoEquipo.nombre}</p>
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
                <p className="text-sm font-medium">
                  Observaciones: {observaciones}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-4">Chequeos:</h2>
              {equipoSeleccionado.chequeos.some(chequeo => chequeo.mantenimiento.idMantenimiento === mantenimientoId && chequeo.descripcion === "Completado") ? (
                <p>Ya se le realizó el chequeo a este equipo.</p>
              ) : (
                <>
                  <Button
                    className="mr-4 bg-red-500 text-red-50 hover:bg-red-600"
                    onClick={() => handleOpenModal("Fallas")}
                  >
                    Reportar Fallas
                  </Button>
                  <Button
                    className="bg-green-500 text-green-50 hover:bg-green-600"
                    onClick={() => handleOpenModal("Completado")}
                  >
                    Marcar Completado
                  </Button>
                </>
              )}

          </div>
          </div>
        )}
      </div>
      {/* Modal de observaciones */}
      {tareaSeleccionada && (
        <form
        onSubmit={handleSubmit}
        className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="modal-content bg-white p-6 rounded-lg shadow-md w-3/4 md:w-1/2">
          <h2 className="text-xl font-bold mb-4">
            {tipoChequeo === "Fallas" ? "Reporte de Fallas" : "Chequeo Completado"}
          </h2>
          <Textarea
            placeholder="Agregar observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full mb-4"
          />
          <Input
            type="text"
            placeholder="Link de evidencia"
            value={linkEvidencia}
            onChange={(e) => setLinkEvidencia(e.target.value)}
            className="w-full mb-4"
          />
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => setTareaSeleccionada(null)}
              className="mr-4"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-500 text-white">
              Guardar
            </Button>
          </div>
        </div>
      </form>      
      )}
      <div className="flex justify-center mt-2">
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
}

export default GestionMantenimiento;
