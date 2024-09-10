import axiosInstance from '@/helpers/axiosConfig';
import React, { useRef, useState } from 'react';

const ImportButton = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSelectFile = () => {
    fileInputRef.current.click(); // Esto dispara el diálogo de archivo
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo primero.');
      return;
    }
    console.log('Archivo seleccionado:', file); // Log para verificar el archivo

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Subir el archivo al backend
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/equipos/importar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // El backend ya debe devolver un objeto JSON, no necesitas response.json()
      alert(response.data.message);
      setFile(null); // Resetear el archivo seleccionado después de la carga
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      alert('Error al cargar el archivo');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
      {!file ? (
        <>
          <button
            onClick={handleSelectFile}
            className="bg-[#1565c0] text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Seleccionar archivo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }} // Esconde el input de archivo
            onChange={handleFileChange}
          />
        </>
      ) : (
        <button
          onClick={handleUpload}
          className="bg-blue-300 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Cargar archivo
        </button>
      )}
    </div>
  );
};

export default ImportButton;
