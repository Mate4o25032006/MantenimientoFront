import { useState } from "react";
import usePostData from "../../hooks/usePostData";
import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { useNavigate } from 'react-router-dom';
import { Select } from "@/components/forms/elements/select";

export const FormCuetadantes = () => {
    const initialData = { documento: "", nombre: "", dependencia: "", departamento: "", tipoContrato: "" };
    const [inputs, setInputs] = useState(initialData);

    const validations = {
        documento: [
            {
                validate: value => value.trim() !== "",
                message: "El documento es obligatorio."
            },
            {
                validate: value => /^[0-9]{6,10}$/.test(value),
                message: "El documento debe tener entre 6 y 10 dígitos."
            }
        ],
        nombre: [
            {
                validate: value => value.trim() !== "",
                message: "El nombre es obligatorio."
            }
        ],
        dependencia: [
            {
                validate: value => value.trim() !== "",
                message: "La dependencia es obligatoria."
            }
        ],
        departamento: [
            {
                validate: value => value.trim() !== "",
                message: "El departamento es obligatorio."
            }
        ],
        tipoContrato: [
            {
                validate: value => value.trim() !== "",
                message: "El tipo de contrato es obligatorio."
            }
        ]
    };

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

    const handleSubmit = usePostData("cuentadantes", onSubmit, inputs, validations);

    return (
        <Forms className="form-background">
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario CuentaDantes</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {inputs1.map(input => (
                    <Input key={input.id} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required} handleInputChange={handleInputChange} />
                ))}
                <Select
                    label="Tipo Contrato"
                    name="tipoContrato"
                    value={inputs.tipoContrato}
                    onChange={handleInputChange}
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
