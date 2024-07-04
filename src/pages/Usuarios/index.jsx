import { useState } from "react";
import usePostData from "../../hooks/usePostData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { useNavigate } from 'react-router-dom';

export const FormUsuarios = () => {
    const initialData = {documento : "", nombre : "", fechaInicio : "", fechaFin: "", observaciones: "", correo: "", contrasenia: ""};
    const [inputs, setInputs] = useState(initialData);

    const inputs1 = [
        {
            id: 1,
            type: "number",
            name: "documento",
            placeholder: "12345678",
            value: inputs.documento,
            required: true
        },
        {
            id: 2,
            type: "text",
            name: "nombre",
            placeholder: "James Rodriguez",
            value: inputs.nombre,
            required: true
        },
        {
            id: 3,
            type: "date",
            name: "fechaInicio",
            placeholder: "2020-10-20",
            value: inputs.fechaInicio,
            required: true
        },
        {
            id: 4,
            type: "date",
            name: "fechaFin",
            placeholder: "2020-10-20",
            value: inputs.fechaFin,
            required: true
        },
        {
            id: 5,
            type: "text",
            name: "observaciones",
            placeholder: "Observación",
            value: inputs.observaciones,
            required: true
        },
        {
            id: 6,
            type: "email",
            name: "correo",
            placeholder: "ejemplo@gmail.com",
            value: inputs.correo,
            required: true
        },
        {
            id: 7,
            type: "password",
            name: "contrasenia",
            placeholder: "Contraseña",
            value: inputs.contrasenia,
            required: true
        }
    ];

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const onSubmit = () => {
        navigate("/admin", { replace: true });
    };

    const handleSubmit = usePostData("auth/registro", onSubmit, { ...inputs, estado_id: 1 });

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario Usuarios</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input key={input.id} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required} handleInputChange={handleInputChange} />
                ))}
                <div className="col-span-1 md:col-span-2 flex items-center justify-center mt-6">
                <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
