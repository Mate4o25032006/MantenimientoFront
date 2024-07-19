import { useState } from "react";
import usePostData from "../../hooks/usePostData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { useNavigate } from 'react-router-dom';

export const FormAreas = () => {
    const initialData = { codigo: "", nombre: "", zona: "", coordenadas: "" };
    const [inputs, setInputs] = useState(initialData);
    const navigate = useNavigate();

    const inputs1 = [
        { 
            id: 1, 
            type: 'text', 
            name: 'codigo', 
            placeholder: 'Ingrese el código del Area', 
            value: inputs.codigo, 
            required: true 
        },
        { 
            id: 2, 
            type: 'text', 
            name: 'nombre', 
            placeholder: 'Ingrese nombre del Area', 
            value: inputs.nombre, 
            required: true 
        },
        { 
            id: 3, 
            type: 'text', 
            name: 'zona', 
            placeholder: 'Ingrese la zona', 
            value: inputs.zona, 
            required: true 
        },
        {
            id: 4, 
            type: 'text', 
            name: 'coordenadas', 
            placeholder: 'Ingrese las coordenadas del area', 
            value: inputs.coordenadas, 
            required: true 
        },
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
        navigate("/admin", { replace: true });
    };

    const handleSubmit = usePostData("areas", onSubmit, inputs);

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario Areas</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input key={input.id} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required} value={input.value} handleInputChange={handleInputChange} />
                ))}
                <div className={inputs1.length % 2 === 0 ? "md:col-span-2" : "flex items-center justify-center mt-6"}>
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
