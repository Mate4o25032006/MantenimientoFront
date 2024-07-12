import { useState } from "react";
import usePostData from "../../hooks/usePostData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { useNavigate } from 'react-router-dom';
import { Select } from "@/components/forms/elements/select";

export const FormCuetadantes = () => {
    const initialData = {documento : "", nombre : "", dependencia : "", departamento: "", tipoContrato: ""};
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
            placeholder: "Cristiano Ronaldo",
            value: inputs.nombre,
            required: true
        },
        {
            id: 3,
            type: "text",
            name: "dependencia",
            placeholder: "SENA",
            value: inputs.dependencia,
            required: true
        },
        {
            id: 4,
            type: "text",
            name: "departamento",
            placeholder: "Sistemas",
            value: inputs.departamento,
            required: true
        },
    ];

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const onSubmit = () => {
        navigate("/admin", { replace: true });
    };

    const handleSubmit = usePostData("cuentadantes", onSubmit, inputs);

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario CuentaDantes</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input key={input.id} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required} handleInputChange={handleInputChange} />
                ))}
                <Select
                    label="Tipo Contrato"
                    name="tipoContrato"
                    handleInputChange={handleInputChange}
                    options={[
                        {
                            value: "Vinculado",
                            label: "Vinculado",
                        },
                        {
                            value: "Contratista",
                            label: "Contratista",
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
