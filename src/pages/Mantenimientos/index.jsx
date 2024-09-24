import { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { Select as CustomSelect } from "../../components/forms/elements/select";
import usePostData from "../../hooks/usePostData";
import useGetData from "../../hooks/useGetData";
import { Forms } from "../../layout/Forms";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Select } from "../../components/forms/elements/select";


export const FormMantenimientos = () => {
    const initialData = { objetivo: "", tipoMantenimiento: "", fechaProxMantenimiento: "", fechaUltimoMantenimiento: "", usuario: "" };
    const [inputs, setInputs] = useState(initialData);
    const navigate = useNavigate();
    const urls = ["usuarios"];

    const { data, error, loading } = useGetData(urls);

    const usuariosTecnicos = useMemo(() => {
        return data?.usuarios?.filter(usuario => 
            usuario.roles.some(rol => rol.nombre === "TÉCNICO EN CAMPO")
        ) || [];
    }, [data?.usuarios]);
    

    const validations = {
        objetivo: [
            {
                validate: value => value.trim() !== "",
                message: "El objetivo es obligatorio."
            }
        ],
        fechaProxMantenimiento: [
            {
                validate: value => value.trim() !== "",
                message: "La fechaProxMantenimiento es obligatorio."
            }
        ],
        fechaUltimoMantenimiento: [
            {
                validate: value => value.trim() !== "",
                message: "La fecha de ultimo mantenimiento es obligatoria."
            }
        ],
    };

    const inputs1 = [
        { 
            id: 1, 
            type: 'text', 
            name: 'objetivo', 
            placeholder: 'Ingrese el objetivo del mantenimiento', 
            value: inputs.objetivo, 
            required: true 
        },
        { 
            id: 2, 
            type: 'date', 
            name: 'fechaProxMantenimiento', 
            placeholder: 'Ingrese la fecha del próximo mantenimiento', 
            value: inputs.fechaProxMantenimiento, 
            required: true 
        },
        { 
            id: 3, 
            type: 'date', 
            name: 'fechaUltimoMantenimiento', 
            placeholder: 'Ingrese la fecha del último mantenimiento', 
            value: inputs.fechaUltimoMantenimiento, 
            required: true 
        },
    ];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const onSubmit = () => {
        navigate("/admin", { replace: true });
    };


    const handleSubmit = usePostData("mantenimientos", onSubmit, inputs, validations);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario Mantenimientos</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input key={input.id} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required} handleInputChange={handleInputChange} />
                ))}
                <CustomSelect
                    label="Responsable Mantenimiento"
                    name="usuario"
                    onChange={handleInputChange}
                    options={usuariosTecnicos.map(usuario => ({ value: usuario.documento, label: usuario.nombre }))}
                />
                <Select
                    label="Tipo Mantenimiento"
                    name="tipoMantenimiento"
                    value={inputs.tipoMantenimiento}
                    onChange={handleInputChange}
                    options={[
                        {
                            value: "Preventivo",
                            label: "Preventivo",
                        },
                        {
                            value: "Correctivo",
                            label: "Correctivo",
                        },
                        {
                            value: "Predictivo",
                            label: "Predictivo",
                        },
                    ]}
                />
                <div className={inputs1.length % 2 === 0 ? "md:col-span-2" : "flex items-center justify-center mt-6"}>
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
