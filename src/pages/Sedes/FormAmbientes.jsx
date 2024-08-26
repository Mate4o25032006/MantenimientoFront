import { useState } from "react";
import usePostData from "../../hooks/usePostData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { useNavigate } from 'react-router-dom';
import useGetData from "@/hooks/useGetData";
import { Select } from "@/components/forms/elements/select";

export const FormAmbientes = () => {
    const initialData = { nombre: "", dependencia: "" };
    const [inputs, setInputs] = useState(initialData);
    const navigate = useNavigate();
    const urls = ["dependencias"];
    const { data, error, loading } = useGetData(urls);

    const validations = {
        nombre: [
            {
                validate: value => value.trim() !== "",
                message: "El nombre es obligatorio."
            }
        ],
    }

    const inputs1 = [
        { 
            id: 1, 
            type: 'text', 
            name: 'nombre', 
            placeholder: 'Ingrese nombre del ambiente', 
            value: inputs.nombre, 
            required: true 
        }
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

    const handleSubmit = usePostData("ambientes", onSubmit, inputs, validations);

    if (loading) {l
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario Ambientes</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input key={input.id} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required} value={input.value} handleInputChange={handleInputChange} />
                ))}
                <Select
                    label="Dependencias"
                    name="dependencia"
                    value={inputs.dependencia}
                    onChange={handleInputChange}
                    options={data.dependencias.map(dependencia => ({ value: dependencia.idDependencia, label: dependencia.nombre }))}
                />
                <div className={inputs1.length % 2 === 0 ? "md:col-span-2" : "flex items-center justify-center mt-6"}>
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
