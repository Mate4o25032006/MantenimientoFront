import { Input } from "../../components/forms/elements/input";
import { Button } from "../../components/forms/elements/button";
import useLogin from "../../hooks/useLogin";
import Layout from "../../layout"
import Sena from "../../assets/Sena.png";
import ImagenLogin from "../../assets/ImagenLogin.png";

export const Login = () => {
    const handleSubmit = useLogin()
    const inputs1 = [
        {
            id: 1,
            type: "email",
            name: "Email",
            placeholder: "ejemplo@gmail.com",
            required: true
        },
        {
            id: 2,
            type: "password",
            name: "Password",
            placeholder: "Contraseña",
            required: true
        }
    ]

    return (
        <Layout>
            <section className="flex gap-4 justify-between shadow-lg border mb-8 w-[70%] h-[580px] rounded-lg overflow-hidden mt-3">
                <div className="flex flex-col items-center justify-center lg:w-[50%] bg-white/50">
                    <h1 className="text-center my-2 mb-8 text-2xl font-semibold">Iniciar Sesión</h1>
                    <form className="flex flex-col gap-3 w-[80%]" onSubmit={ handleSubmit }>
                        {inputs1.map(input => (
                            <Input
                                key={input.id}
                                type={input.type}
                                name={input.name}
                                placeholder={input.placeholder}
                                required={input.required}
                            />
                        ))}
                        <div className="md:col-span-2">
                            <Button
                                type={'submit'}
                                name={'Enviar'}
                            />
                        </div>
                    </form>
                </div>
                <div className="w-[50%] h-full bg-gradient-to-r from-[#81d4fa] to-[#1976d2] bg-login lg:flex flex-col justify-between items-end p-5 hidden md:flex ">
                    <figure className=" h-[10%]">
                        <img src={Sena} alt="sena" className="ml-1 h-[100%]" />
                    </figure>

                    {/* <figure className=" h-[100%] flex justify-center items-start"> */}
                        <img src={ImagenLogin} className="justify-center items-start w-[70%] h-[70%] fit object-fill mr-2 mb-[-6%] "/>
                    {/* </figure> */}
                </div>
            </section>
        </Layout>
    )
}