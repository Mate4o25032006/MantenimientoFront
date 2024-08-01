import { useState } from "react";
import usePostData from "../../hooks/usePostData";
import useGetData from "../../hooks/useGetData";
import { Button } from "../../components/forms/elements/button";
import { Forms } from "../../layout/Forms";
import { Select } from "../../components/forms/elements/select";
import { useNavigate } from 'react-router-dom';

export const FormRoles = () => {
    const initialData = { usuario_documento: "", rol_id: "" };
    const [inputs, setInputs] = useState(initialData);
    const navigate = useNavigate();

    const urls = ["usuarios", "roles"];
    const { data, error, loading } = useGetData(urls);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const onSubmit = () => {
        navigate("/", { replace: true });
    };

    const handleSubmit = usePostData("roles/asociaUsuarios", onSubmit, inputs);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario Asignación de Roles</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                <Select
                    label="Nombre Usuario"
                    name="usuario_documento"
                    onChange={handleInputChange}
                    options={data.usuarios.map(usuario => ({ value: usuario.documento, label: usuario.nombre }))}
                />
                <Select
                    label="Rol"
                    name="rol_id"
                    onChange={handleInputChange}
                    options={data.roles.map(rol => ({ value: rol.id, label: rol.nombre }))}
                />
                <div className="md:col-span-2">
                    <Button type={'submit'} name={'Enviar'} />
                </div>
            </form>
        </Forms>
    );
};
