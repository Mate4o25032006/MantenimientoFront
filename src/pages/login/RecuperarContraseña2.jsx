import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/helpers/axiosConfig';

const RecuperarContrasena = () => {
  const { token } = useParams(); // Captura el token de la URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  // Manejar el cambio de la contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Enviar la nueva contraseña y el token al backend
      const response = await axiosInstance.post('https://sistemamantenimiento-production.up.railway.app/usuarios/recuperar-contrasenia/:token', {
        token,
        password
      });

      if (response.data.success) {
        // Redirigir a la página de inicio de sesión después de actualizar la contraseña
        navigate('/login');
      }
    } catch (error) {
      setError('Hubo un error al actualizar la contraseña.');
    }
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nueva Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </div>
  );
};

export default RecuperarContrasena;
