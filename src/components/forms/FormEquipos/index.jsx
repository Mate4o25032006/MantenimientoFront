// import { useContext } from "react";
// import { TurisContext } from "../../../Context";
import { useLocation, useNavigate } from "react-router-dom";
import useSendData from "../../../hooks/useSendData";
import useEditData from "../../../hooks/useEditData";
import Forms from "../../Layout/Forms";
import Button from "../Elements/Buttons";
import Input from "../Elements/Inputs";
// import Select from "../Elements/Select";
// import TextArea from "../Elements/TextArea";
// import imgHeader from "../../../assets/img/romero.jpg"

export const FormEstablecimiento = () => {
    const { pathname } = useLocation()
    // const { setImageNav } = useContext(TurisContext)
    let handleSubmit
    // setImageNav(imgHeader)
    const navigate = useNavigate()
    const Inputs = [
        {
            id: 1,
            type: 'text',
            name: 'Serial',
            placeholder: 'Ingrese el serial del equipo',
            required: true
        },
        {
            id: 2,
            type: 'text',
            name: 'Marca',
            placeholder: 'Ingrese la marca del equipo',
            required: true
        },
        {
            id: 3,
            type: 'text',
            name: 'Referencia',
            placeholder: 'Ingrese la referencia del equipo',
            required: true
        },
        {
            id: 4,
            type: 'text',
            name: 'hostName',
            placeholder: 'Ingrese el contacto del establecimiento',
            required: true
        },
        {
            id: 5,
            type: 'text',
            name: 'SistemaOperativo',
            placeholder: 'Ingrese el sistema operativo del equipo',
            required: true
        },
        {
            id: 6,
            type: 'text',
            name: 'SoftwareInstalado',
            placeholder: 'Ingrese el software instalado del equipo',
            required: true
        },
        {
            id: 7,
            type: 'date',
            name: 'FechaCompra',
            placeholder: 'Ingrese la fecha de compra del equipo',
            required: true
        },
        {
            id: 8,
            type: 'number',
            name: 'codigoArea',
            placeholder: 'Ingrese el codigo de area del equipo',
            required: true
        },
        {
            id: 9,
            type: 'text',
            name: 'placaSena',
            placeholder: 'Ingrese la placa Sena del equipo',
            required: true
        },
    ]

    const onSubmit = () => {
        //envio de datos
        navigate("/admin", {
            replace: true,
        });
    }
    if (pathname.includes("/admin/editar")) {
        handleSubmit = useEditData("establecimiento", onSubmit)
    } else {
        handleSubmit = useSendData("establecimiento", onSubmit)
    }

    return (
        <Forms>
            <h1 className="text-center my-2 mb-8 text-xl font-semibold">Formulario de ingreso de establecimientos</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {Inputs.map(input => (
                    <Input
                        key={input.id}
                        type={input.type}
                        name={input.name}
                        placeholder={input.placeholder}
                        required={input.required}
                    />
                ))}
                {/* <Select
                    label="Tipo de establecimiento"
                    name="tipo_negocio"
                    options={[
                        {
                            value: "Restaurante",
                            label: "Restaurante",
                        },
                        {
                            value: "Hotel",
                            label: "Hotel",
                        },
                    ]}
                />
                <TextArea
                    name={'Descripción'}
                    placeholder={'Ingrese la descripción del lugar'}
                    required={true}
                /> */}
                <div className="md:col-span-2" >
                    <Button
                        type={'submit'}
                        name={'Enviar'}
                    />
                </div>
            </form>
        </Forms>
    )
}
