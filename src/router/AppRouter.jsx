// routes.js
import { useRoutes } from 'react-router-dom';
import { Login, HomePage, FormUsuarios, FormEquipos, FormRoles, FormCuetadantes, FormMantenimientos, ListaEquipos, ListaUsuarios, GestionMantenimiento, FormTipos, FormSubsedes } from '../pages/';
import {ProtectedRoute} from './ProtectedRoute';
import {LoginRoute} from './LoginRoute';
import { FormList } from '@/pages/ListaFormularios/FormList';
import { Checklist } from '@/components/forms/FormMantenimiento/checklist';
import { ListaMantenimientos } from '@/pages/Mantenimientos/ListaMantenimiento';
import { Listas } from '@/pages/Listas/Lista';
import { ListaCuentaDante } from '@/pages/Cuentadantes/ListaCuentaDante';
import { ListaTipo } from '@/pages/TipoEquipos/ListaTipos';
import { FormDependencias } from '@/pages/Sedes/FormDependencias';
import { FormAmbientes } from '@/pages/Sedes/FormAmbientes';
import { ListaSubsedes } from '@/pages/Sedes/ListaSubsedes';
import ListaDependencias from '@/pages/Sedes/ListaDependencias';
import ListaAmbientes from '@/pages/Sedes/ListaAmbientes';
import { RecuperarContraseña } from '@/pages/login/RecuperarContraseña';
import RecuperarContrasena from '@/pages/login/RecuperarContraseña2';

export const AppRoutes = () => {
    return useRoutes([
        { 
            path: '/', 
            element: (
                <LoginRoute>
                    <Login /> 
                </LoginRoute>
            )
        },
        { 
            path: '/login', 
            element: (
                    <Login /> 
            )
        },
        { 
            path: '/usuarios/recuperar-contrasenia', 
            element: <RecuperarContraseña />
        },
        { 
            path: '/usuarios/recuperar-contraseña/:token', 
            element: <RecuperarContrasena />
        },        
        {
            path: '/admin',
            element: (
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            ),
        },
        {
            path: '/formularios',
            element: (
                <ProtectedRoute>
                    <FormList />
                </ProtectedRoute>
            ),
        },
        {
            path: '/listas',
            element: (
                <ProtectedRoute>
                    <Listas />
                </ProtectedRoute>
            ),
        },
        {
            path: '/formularios/usuarios',
            element: (
                <ProtectedRoute>
                    <FormUsuarios />
                </ProtectedRoute>
            ),
        },
        {
            path: '/formularios/equipos',
            element: (
                <ProtectedRoute>
                    <FormEquipos />
                </ProtectedRoute>
            ),
        },
        {
            path: '/formularios/cuentadantes',
            element: (
                <ProtectedRoute>
                    <FormCuetadantes />
                </ProtectedRoute>
            ),
        },
        {
            path: '/formularios/mantenimientos',
            element: (
                <ProtectedRoute>
                    <FormMantenimientos />
                </ProtectedRoute>
            ),
        },
        {
            path: '/formularios/subsedes',
            element: (
                <ProtectedRoute>
                    <FormSubsedes />
                </ProtectedRoute>
            ),
        },
        {
            path: '/formularios/dependencias',
            element: (
                <ProtectedRoute>
                    <FormDependencias />
                </ProtectedRoute>
            ),
        },
        {
            path: '/formularios/ambientes',
            element: (
                <ProtectedRoute>
                    <FormAmbientes />
                </ProtectedRoute>
            ),
        },
        {
            path: '/formularios/tipoEquipos',
            element: (
                <ProtectedRoute>
                    <FormTipos />
                </ProtectedRoute>
            ),
        },
        {
            path: '/asignacionRoles',
            element: (
                <ProtectedRoute>
                    <FormRoles />
                </ProtectedRoute>
            ),
        },
        {
            path: '/asignacionEquipos',
            element: (
                <ProtectedRoute>
                    <Checklist />
                </ProtectedRoute>
            ),
        },
        {
            path: '/equipos/lista',
            element: (
                <ProtectedRoute>
                    <ListaEquipos />
                </ProtectedRoute>
            ),
        },
        {
            path: '/usuarios/lista',
            element: (
                <ProtectedRoute>
                    <ListaUsuarios />
                </ProtectedRoute>
            ),
        },
        {
            path: '/mantenimientos/lista',
            element: (
                <ProtectedRoute>
                    <ListaMantenimientos />
                </ProtectedRoute>
            ),
        },
        {
            path: '/mantenimientos/:idMantenimiento/equipos',
            element: (
                <ProtectedRoute>
                    <GestionMantenimiento />
                </ProtectedRoute>
            ),
        },
        {
            path: '/cuentadantes/lista',
            element: (
                <ProtectedRoute>
                    <ListaCuentaDante />
                </ProtectedRoute>
            ),
        },
        {
            path: '/subsedes/lista',
            element: (
                <ProtectedRoute>
                    <ListaSubsedes />
                </ProtectedRoute>
            ),
        },
        {
            path: '/dependencias/lista',
            element: (
                <ProtectedRoute>
                    <ListaDependencias />
                </ProtectedRoute>
            ),
        },        {
            path: '/ambientes/lista',
            element: (
                <ProtectedRoute>
                    <ListaAmbientes />
                </ProtectedRoute>
            ),
        },
        {
            path: '/tipoEquipos/lista',
            element: (
                <ProtectedRoute>
                    <ListaTipo />
                </ProtectedRoute>
            ),
        },
    ]);
};

