import { useState, useEffect } from "react";
import usePostData from "../../hooks/usePostData";
import useGetData from "../../hooks/useGetData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Select } from "../../components/forms/elements/select";
import { Forms } from "../../layout/Forms";
import { useNavigate } from 'react-router-dom';

export const FormEquipos = () => {
    const initialData = { 
        serial: "", 
        marca: "", 
        referencia: "", 
        fechaCompra: "", 
        placaSena: "", 
        tipoEquipo: "", 
        cuentaDante: "", 
        subsede: "", 
        dependencia: "",
        ambiente: "" 
    };
    const [inputs, setInputs] = useState(initialData);
    const [filteredDependencias, setFilteredDependencias] = useState([]);
    const [filteredAmbientes, setFilteredAmbientes] = useState([]);
    const navigate = useNavigate();

    const urls = ["tipoEquipos", "cuentadantes", "subsedes", "dependencias", "ambientes"];
    const { data, error, loading } = useGetData(urls);

    useEffect(() => {
        if (inputs.subsede && data.dependencias) {
            const subsedeId = parseInt(inputs.subsede, 10);
            const filtered = data.dependencias.filter(dep => dep.subsede.idSubsede === subsedeId);
            setFilteredDependencias(filtered);
        }
    }, [inputs.subsede, data.dependencias]);

    useEffect(() => {
        if (inputs.dependencia && data.ambientes) {
            const dependenciaId = parseInt(inputs.dependencia, 10);
            const filtered = data.ambientes.filter(dep => dep.dependencia.idDependencia === dependenciaId);
            setFilteredAmbientes(filtered);
        }
    }, [inputs.dependencia, data.ambientes]);

    const validations = {
        serial: [
            {
                validate: value => value.trim() !== "",
                message: "El serial es obligatorio."
            }
        ],
        marca: [
            {
                validate: value => value.trim() !== "",
                message: "La marca es obligatoria."
            }
        ],
        referencia: [
            {
                validate: value => value.trim() !== "",
                message: "La referencia es obligatoria."
            }
        ],
        fechaCompra: [
            {
                validate: value => value.trim() !== "",
                message: "La fecha de compra es obligatoria."
            }
        ],
        placaSena: [
            {
                validate: value => value.trim() !== "",
                message: "La placa Sena es obligatoria."
            }
        ],
        tipoEquipo: [
            {
                validate: value => value.trim() !== "",
                message: "El tipo de equipo es obligatorio."
            }
        ],
        cuentaDante: [
            {
                validate: value => value.trim() !== "",
                message: "La cuenta Dante es obligatoria."
            }
        ],
        subsede: [
            {
                validate: value => value.trim() !== "",
                message: "La subsede es obligatoria."
            }
        ],
    };

    const inputs1 = [
        { id: 1, type: 'text', name: 'serial', placeholder: 'Ingrese el serial del equipo', value: inputs.serial, required: true },
        { id: 2, type: 'text', name: 'marca', placeholder: 'Ingrese la marca del equipo', value: inputs.marca, required: true },
        { id: 3, type: 'text', name: 'referencia', placeholder: 'Ingrese la referencia del equipo', value: inputs.referencia, required: true },
        { id: 4, type: 'date', name: 'fechaCompra', placeholder: 'Ingrese la fecha de compra del equipo', value: inputs.fechaCompra, required: true },
        { id: 5, type: 'text', name: 'placaSena', placeholder: 'Ingrese la placa Sena del equipo', value: inputs.placaSena, required: true },
    ];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleFormReset = () => {
        setInputs(initialData);
    };

    const onSubmit = () => {
        handleFormReset();
        navigate("/", { replace: true });
    };

    const handleSubmit = usePostData("equipos", onSubmit, { ...inputs, estado_id: 1 }, validations);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario Equipos</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
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
                <Select
                    label="Tipo de Equipo"
                    name="tipoEquipo"
                    value={inputs.tipoEquipo}
                    onChange={handleInputChange}
                    options={data.tipoEquipos.map(tipo => ({ value: tipo.id, label: tipo.nombre }))}
                />
                <Select
                    label="Cuenta Dante"
                    name="cuentaDante"
                    value={inputs.cuentaDante}
                    onChange={handleInputChange}
                    options={data.cuentadantes.map(cuentaDante => ({ value: cuentaDante.documento, label: cuentaDante.nombre }))}
                />
                <Select
                    label="Subsede"
                    name="subsede"
                    value={inputs.subsede}
                    onChange={handleInputChange}
                    options={data.subsedes.map(subsede => ({ value: subsede.idSubsede, label: subsede.nombre }))}
                />
                {inputs.subsede && filteredDependencias.length > 0 && (
                    <Select
                        label="Dependencia"
                        name="dependencia"
                        value={inputs.dependencia}
                        onChange={handleInputChange}
                        options={filteredDependencias.map(dependencia => ({ value: dependencia.idDependencia, label: dependencia.nombre }))}
                    />
                )}
                {inputs.dependencia && filteredAmbientes.length > 0 && (
                    <Select
                        label="Ambiente"
                        name="ambiente"
                        value={inputs.ambiente}
                        onChange={handleInputChange}
                        options={filteredAmbientes.map(ambiente => ({ value: ambiente.idAmbiente, label: ambiente.nombre }))}
                    />
                )}
                <div className={inputs1.length % 1 === 0 ? "md:col-span-2" : "flex items-center justify-center mt-6"}>
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
