import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sena from "../../assets/Sena.png";
import ImagenLogin from "../../assets/ImagenLogin.jpg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axiosInstance from '@/helpers/axiosConfig';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const RecuperarContrasena = () => {
  const { token } = useParams(); // Captura el token de la URL
  const navigate = useNavigate();

  // Estado para la contraseña
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Manejar el cambio de la contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar la nueva contraseña y el token al backend
      const url = `/usuarios/recuperar-contrasenia/${token}`;
      const response = await axiosInstance.post(url, { password });

      if (response.data.message) {
        // Mostrar alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Contraseña actualizada correctamente.',
        }).then(() => {
          // Redirigir a la página de inicio de sesión después de actualizar la contraseña
          navigate('/');
        });
      } else {
        setError('Hubo un error al actualizar la contraseña.');
        // Mostrar alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar la contraseña.',
        });
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error); // Muestra más detalles del error
      setError('Hubo un error al actualizar la contraseña.');
      // Mostrar alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al actualizar la contraseña.',
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 w-full bg-cover bg-center bg-no-repeat" 
         style={{ backgroundImage: `url(${ImagenLogin})` }}>
      <style jsx>{`
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1;
        }
        @media (max-width: 768px) {
          .login-bg {
            display: none;
          }
        }
        .login-bg {
          width: 1184px;
          height: 672px;
        }
      `}</style>

      <div className="overlay"></div>
      <div className="relative flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full z-10">
        {/* Primera columna */}
        <div className="flex flex-col justify-center items-center p-8 md:w-1/2 bg-blue-100">
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 h-8 w-8 rounded-full" />
            <div className="ml-2 text-2xl font-bold text-blue-900">¡Hola!</div>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Bienvenidos!</h1>
          <p className="text-blue-700 mb-6">
            Este es un software utilizado para la gestión del mantenimiento de los equipos tecnológicos del Sena CIAA, solo es para usuarios ya registrados.
          </p>
        </div>

        {/* Segunda columna */}
        <div className="flex flex-col justify-center items-center p-8 md:w-1/2 bg-white">
          <img src={Sena} alt="Descripción de la imagen" className="w-20 h-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Recuperar Contraseña</h2>
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div className="mb-6">
              <Label htmlFor="password" className="block text-blue-700">
                Contraseña
              </Label>
              <Input
                name="password"
                type="password"
                placeholder="Contraseña"
                className="w-full mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-full">Enviar</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
