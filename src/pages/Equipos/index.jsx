import { useState } from "react";
import usePostData from "../../hooks/usePostData";
import useGetData from "../../hooks/useGetData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { Select } from "../../components/forms/elements/select";
import { useNavigate } from 'react-router-dom';

export const FormEquipos = () => {
    const initialData = { serial: "", marca: "", referencia: "", fechaCompra: "", placaSena: "", tipoEquipo: "", cuentaDante: "", area: "" };
    const [inputs, setInputs] = useState(initialData);
    const navigate = useNavigate();

    const urls = ["tipoEquipos", "cuentadantes", "areas"];
    const { data, error, loading } = useGetData(urls);

    const inputs1 = [
        { 
            id: 1, 
            type: 'text', 
            name: 'serial', 
            placeholder: 'Ingrese el serial del equipo', 
            value: inputs.serial, 
            required: true 
        },
        { 
            id: 2, 
            type: 'text', 
            name: 'marca', 
            placeholder: 'Ingrese la marca del equipo', 
            value: inputs.marca, 
            required: true 
        },
        { 
            id: 3, 
            type: 'text', 
            name: 'referencia', 
            placeholder: 'Ingrese la referencia del equipo', 
            value: inputs.referencia, 
            required: true 
        },
        { 
            id: 4, 
            type: 'date', 
            name: 'fechaCompra', 
            placeholder: 'Ingrese la fecha de compra del equipo', 
            value: inputs.fechaCompra, 
            required: true 
        },
        {
            id: 5, 
            type: 'text', 
            name: 'placaSena', 
            placeholder: 'Ingrese la placa Sena del equipo', 
            value: inputs.placaSena, 
            required: true 
        },
    ];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const onSubmit = () => {
        navigate("/", { replace: true });
    };

    const handleSubmit = usePostData("equipos", onSubmit, { ...inputs, estado_id: 1 });

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
                    <Input key={input.id} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required} handleInputChange={handleInputChange} />
                ))}
                <Select
                    label="Tipo de Equipo"
                    name="tipoEquipo"
                    onChange={handleInputChange}
                    options={data.tipoEquipos.map(tipo => ({ value: tipo.id, label: tipo.nombre }))}
                />
                <Select
                    label="Cuenta Dante"
                    name="cuentaDante"
                    onChange={handleInputChange}
                    options={data.cuentadantes.map(cuentaDante => ({ value: cuentaDante.documento, label: cuentaDante.nombre }))}
                />
                <Select
                    label="Area"
                    name="area"
                    onChange={handleInputChange}
                    options={data.areas.map(area => ({ value: area.codigo, label: area.zona }))}
                />
                <div className={inputs1.length % 2 === 0 ? "md:col-span-2" : "flex items-center justify-center mt-6"}>
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
