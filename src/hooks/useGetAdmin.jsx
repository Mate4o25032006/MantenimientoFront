import { useContext, useEffect, useState } from "react";
import { MantenContext } from "../Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const useGetAdmin = () => {
    const navigate = useNavigate();
    const { tokenSession, setAdmin, setLoader } = useContext(MantenContext);
    const [adminSession, setAdminSession] = useState();

    useEffect(() => {
        const fetchData = async () => {
            setLoader(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`, {
                    headers: {
                        "Authorization": `Bearer ${tokenSession}`
                    }
                });
                setLoader(false);
                setAdmin(true);
                setAdminSession(true);
                console.log(response);
            } catch (error) {
                console.log(error);
                setLoader(false);
                setAdmin(false);
                setAdminSession(false);
                
                // Mostrar alerta y esperar a que termine
                await Swal.fire({
                    title: "Oops....",
                    text: "No tienes Autorización para entrar a este apartado. Por favor inicie sesión.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2500,
                });

                // Navegar después de que Swal.fire se haya completado
                navigate("/", {
                    replace: true
                });
            }
        };
        fetchData();
    }, [tokenSession, setAdmin, setLoader, navigate]); 
    return adminSession;
};

export default useGetAdmin;
