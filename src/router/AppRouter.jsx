import { useRoutes, BrowserRouter } from "react-router-dom";
import { useContext } from "react";
import { MantenContext } from "../Context";
import Loader from '../components/Loader'
import { Menu } from '../components/home/menu';
import { Layout } from '../layout'
import { Login,HomePage,FormUsuarios,FormEquipos,FormRoles } from '../pages/';

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
        { path: '/usuarios', element: <FormUsuarios /> },
        { path: '/equipos', element: <FormEquipos /> },
        { path: '/asignacionRoles', element: <FormRoles /> }
    ])
    return routes
}
/* La función `AppUi` es un componente de React que define la estructura y el diseño de la aplicación.
Devuelve código JSX que representa la interfaz de usuario de la aplicación. */

export const AppUi = () => {
    const { loader, admin } = useContext(MantenContext);

    return (
        <>
            <BrowserRouter>
                    {loader && <Loader />}
                <Layout>
                    {admin ? <Menu /> : <></> }
                    <AppRoutes />
                </Layout>
            </BrowserRouter>
        </>
    )
}