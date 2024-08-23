import { useState, useEffect } from "react";
import usePostData from "../../hooks/usePostData";
import useGetData from "../../hooks/useGetData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Select } from "../../components/forms/elements/select";
import { Forms } from "../../layout/Forms";
import { useNavigate } from 'react-router-dom';

export const FormEquipos = () => {
    // Estado inicial para los inputs del formulario
    const initialData = { 
        serial: "", 
        marca: "", 
        referencia: "", 
        fechaCompra: "", 
        placaSena: "", 
        tipoEquipo: "", 
        cuentaDante: "", 
        subsede: "", 
        dependencia: "" 
    };
    
    // useState para manejar los valores de los inputs del formulario
    const [inputs, setInputs] = useState(initialData);
    // useState para manejar las dependencias filtradas en base a la subsede seleccionada
    const [filteredDependencias, setFilteredDependencias] = useState([]);
    
    // Hook de React Router para navegar entre páginas
    const navigate = useNavigate();

    // URLs para obtener los datos necesarios para los select (tipoEquipos, cuentadantes, subsedes, dependencias)
    const urls = ["tipoEquipos", "cuentadantes", "subsedes", "dependencias"];
    // Hook personalizado para obtener los datos de las URLs indicadas
    const { data, error, loading } = useGetData(urls);

    // useEffect para actualizar las dependencias filtradas cuando se cambia la subsede seleccionada
    useEffect(() => {
        if (inputs.subsede && data.dependencias) {
            // Convertir la subsede seleccionada a número si es necesario
            const subsedeId = parseInt(inputs.subsede, 10);
            // Filtrar las dependencias que pertenecen a la subsede seleccionada
            const filtered = data.dependencias.filter(dep => dep.subsede.idSubsede === subsedeId);
            // Actualizar el estado con las dependencias filtradas
            setFilteredDependencias(filtered);
        }
    }, [inputs.subsede, data.dependencias]);
    
    // Array de objetos que define los inputs del formulario, incluyendo ID, tipo, nombre, placeholder, valor y si es requerido
    const inputs1 = [
        { id: 1, type: 'text', name: 'serial', placeholder: 'Ingrese el serial del equipo', value: inputs.serial, required: true },
        { id: 2, type: 'text', name: 'marca', placeholder: 'Ingrese la marca del equipo', value: inputs.marca, required: true },
        { id: 3, type: 'text', name: 'referencia', placeholder: 'Ingrese la referencia del equipo', value: inputs.referencia, required: true },
        { id: 4, type: 'date', name: 'fechaCompra', placeholder: 'Ingrese la fecha de compra del equipo', value: inputs.fechaCompra, required: true },
        { id: 5, type: 'text', name: 'placaSena', placeholder: 'Ingrese la placa Sena del equipo', value: inputs.placaSena, required: true },
    ];

    // Función que maneja los cambios en los inputs del formulario
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // Actualiza el estado de los inputs con el nuevo valor
        setInputs({ ...inputs, [name]: value });
    };

    // Función que resetea los valores del formulario a su estado inicial
    const handleFormReset = () => {
        setInputs(initialData);
    };

    // Función que se ejecuta al enviar el formulario y navega a la página de inicio
    const onSubmit = () => {
        handleFormReset();
        navigate("/", { replace: true });
    };

    // Hook personalizado para enviar los datos del formulario a la API
    const handleSubmit = usePostData("equipos", onSubmit, { ...inputs, estado_id: 1 });

    // Mostrar un mensaje de "Cargando..." mientras se obtienen los datos
    if (loading) {
        return <div>Loading...</div>;
    }

    // Mostrar un mensaje de error si hubo un problema al obtener los datos
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario Equipos</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {/* Renderizar cada input definido en el array inputs1 */}
                {inputs1.map(input => (
                    <Input 
                        key={input.id} 
                        type={input.type} 
                        name={input.name} 
                        placeholder={input.placeholder} 
                        required={input.required} 
                        value={input.value} 
                        handleInputChange={handleInputChange} 
                    />
                ))}
                {/* Select para Tipo de Equipo */}
                <Select
                    label="Tipo de Equipo"
                    name="tipoEquipo"
                    value={inputs.tipoEquipo}
                    onChange={handleInputChange}
                    options={data.tipoEquipos.map(tipo => ({ value: tipo.id, label: tipo.nombre }))}
                />
                {/* Select para Cuenta Dante */}
                <Select
                    label="Cuenta Dante"
                    name="cuentaDante"
                    value={inputs.cuentaDante}
                    onChange={handleInputChange}
                    options={data.cuentadantes.map(cuentaDante => ({ value: cuentaDante.documento, label: cuentaDante.nombre }))}
                />
                {/* Select para Subsede */}
                <Select
                    label="Subsede"
                    name="subsede"
                    value={inputs.subsede}
                    onChange={handleInputChange}
                    options={data.subsedes.map(subsede => ({ value: subsede.idSubsede, label: subsede.nombre }))}
                />
                {/* Select para Dependencia (solo se muestra si hay una subsede seleccionada) */}
                {inputs.subsede && (
                    <Select
                        label="Dependencia"
                        name="dependencia"
                        value={inputs.dependencia}
                        onChange={handleInputChange}
                        options={filteredDependencias.map(dependencia => ({ value: dependencia.idDependencia, label: dependencia.nombre }))}
                    />
                )}
                {/* Botón para enviar el formulario */}
                <div className={inputs1.length % 1 === 0 ? "md:col-span-2" : "flex items-center justify-center mt-6"}>
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
