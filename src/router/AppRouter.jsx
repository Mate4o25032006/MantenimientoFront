import { useRoutes, BrowserRouter } from "react-router-dom";
import { useContext } from "react";
import { MantenContext } from "../Context";
import Loader from '../components/Loader'

import { Login,HomePage } from '../pages/';
import useGetAdmin from "../hooks/useGetAdmin";
import { Menu } from "../components/home/menu";

/* La función `AppRoutes` es responsable de definir las rutas de la aplicación usando el gancho
`useRoutes` de la biblioteca `react-router-dom`. Crea una matriz de objetos de ruta, donde cada
objeto representa una ruta específica en la aplicación. Cada objeto de ruta tiene una propiedad
`ruta` que define la ruta URL para esa ruta y una propiedad `elemento` que especifica el componente
que se representará cuando se accede a esa ruta. */
function AppRoutes() {
    let routes = useRoutes([
        { path: '/', element: <Login /> },
        { path: '/admin', element: <HomePage /> },
        { path: '/login', element: <Login /> },

        // { path: '/administrador/editar/:id', element: <Edit /> },
        // { path: '/*', element: <NotFound /> },

    ])
    return routes
}
/* La función `AppUi` es un componente de React que define la estructura y el diseño de la aplicación.
Devuelve código JSX que representa la interfaz de usuario de la aplicación. */

export const AppUi = () => {
    const { loader } = useContext(MantenContext);

    return (
        <>
            <BrowserRouter>
                {/* <Layout> */}
                    {loader && <Loader />}
                    <AppRoutes />
                {/* </Layout> */}
            </BrowserRouter>
        </>
    )
}