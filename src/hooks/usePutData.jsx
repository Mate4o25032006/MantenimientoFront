import axiosInstance from '../helpers/axiosConfig';
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const usePutData = (url) => {
  const navigate = useNavigate();
  const location = useLocation();

  const confirmSubmit = (data) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Confirma que la información sea correcta.",
      icon: 'warning',
      iconColor: 'blue',
      showCancelButton: true,
      confirmButtonColor: '#039be5',
      cancelButtonColor: '#FF4747',
      confirmButtonText: 'Sí, estoy seguro!',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'swal2-container', // Custom class for container
        popup: 'swal2-popup' // Custom class for popup
      }
    }).then((result) => {
      if (result.isConfirmed) {
        acceptSubmit(data);
      }
    });
  };

  const acceptSubmit = async (data) => {
    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/${url}/${data.serial || data.idMantenimiento || data.idSubsede || data.idDependencia || data.idSubsede}`;
      await axiosInstance.put(endpoint, data); 
      Swal.fire({
        title: "¡Bien!",
        text: "La información ha sido actualizada correctamente.",
        icon: "success",
        iconColor: "#007BFF",
        showConfirmButton: false,
        timer: 2500,
        customClass: {
          container: 'swal2-container', // Custom class for container
          popup: 'swal2-popup' // Custom class for popup
        }
      }).then(() => {
        navigate("/admin", { replace: true });
      });
    } catch (error) {
        console.log(data);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Parece que hubo un error: por favor verifique los datos.`,
        confirmButtonColor: "#6fc390",
        customClass: {
          container: 'swal2-container', // Custom class for container
          popup: 'swal2-popup' // Custom class for popup
        }
      });
      console.error(error);
    }
  };

  const handleSubmit = async (data) => {
    confirmSubmit(data);
  };

  return handleSubmit;
};

export default usePutData;
