import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sena from "../../assets/Sena.png";
import ImagenLogin from "../../assets/ImagenLogin.jpg";
import useLogin from '../../hooks/useLogin';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Login = () => {
    const navigate = useNavigate();
    const data = { correo: "", contrasenia: "" };
    const [inputs, setInputs] = useState(data);

    const inputs1 = [
        {
            id: 1,
            type: "email",
            name: "correo",
            placeholder: "ejemplo@gmail.com",
            value: inputs.correo,
            required: true
        },
        {
            id: 2,
            type: "password",
            name: "contrasenia",
            placeholder: "Contraseña",
            value: inputs.contrasenia,
            required: true
        }
    ];

    const handleInputChange = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value,
        });
    };

    const onSubmit = () => {
        navigate("/admin", { replace: true });
    };

    const handleSubmit = useLogin("login", onSubmit, inputs);
    return (
            <div className="relative flex items-center justify-center min-h-screen p-4 w-full bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(${ImagenLogin})` }}>
              <style jsx>{`
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
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
            {/* Primera columna */}
            <div className="flex flex-col justify-center items-center p-8 md:w-1/2 bg-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 h-8 w-8 rounded-full" />
                <div className="ml-2 text-2xl font-bold text-blue-900">¡Hola!</div>
              </div>
              <h1 className="text-4xl font-bold text-blue-900 mb-4">Bienvenidos!</h1>
              <p className="text-blue-700 mb-6">
                Este es un software utilizado para la gestión del mantenimiento de los equipos tecnologicos del Sena CIAA, solo es para usuarios ya registrados.
              </p>
            </div>
    
            {/* Segunda columna */}
            <div className="flex flex-col justify-center items-center p-8 md:w-1/2 bg-white">
            <img src={Sena} alt="Descripción de la imagen" className="w-20 h-auto mb-4" />
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Inicio de sesión</h2>
              <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="username" className="block text-blue-700">
                    Correo electrónico
                  </Label>
                  <Input name="correo" placeholder="correo" className="w-full mt-1" onChange={handleInputChange} />
                </div>
                <div className="mb-6">
                  <Label htmlFor="password" className="block text-blue-700">
                    Contraseña
                  </Label>
                  <Input
                    name="contrasenia"
                    type="password"
                    placeholder="Contraseña"
                    className="w-full mt-1"
                    onChange={handleInputChange}
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-full">Enviar</Button>
              </form>
            </div>
          </div>
        </div>
      ); 
};
