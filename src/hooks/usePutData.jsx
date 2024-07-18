import axiosInstance from '../helpers/axiosConfig';
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const usePutData = (url, onSubmit) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { producto } = location.state || {};

    const aceptSubmit = async () => {
        try {
            const endpoint = `${import.meta.env.VITE_API_URL}/${url}/${producto.serial}`;
            await axiosInstance.put(endpoint, producto); 
            Swal.fire({
                title: "¡Bien!",
                text: "La información ha sido actualizada correctamente.",
                icon: "success",
                showConfirmButton: false,
                timer: 2500,
                customClass: {
                    container: 'swal2-container', // Custom class for container
                    popup: 'swal2-popup' // Custom class for popup
                }
            }).then(() => {
                onSubmit();
                navigate("/admin", { replace: true });
            });
        } catch (error) {
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        confirmSubmit();
    };

    const confirmSubmit = () => {
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
                aceptSubmit();
            }
        });
    }

    return handleSubmit;
};

export default usePutData;
