import React from 'react';
import html2pdf from 'html2pdf.js';

const DownloadPDF = () => {
  const handleDownload = () => {
    const element = document.getElementById('equipment-sheet'); 

    // Configuración de html2pdf
    const opt = {
      margin: 0.5,      // Márgenes en pulgadas
      filename: 'hoja_de_vida_equipo.pdf', // Nombre del archivo
      image: { type: 'jpeg', quality: 0.98 }, // Calidad de las imágenes
      html2canvas: { scale: 2 }, // Aumentar la resolución del canvas
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } // Configuración del PDF
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
    >
      Descargar PDF
    </button>
  );
};

export default DownloadPDF;
