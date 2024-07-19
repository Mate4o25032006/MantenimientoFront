// routes.js
import { useRoutes } from 'react-router-dom';
import { Login, HomePage, FormUsuarios, FormEquipos, FormRoles, FormCuetadantes, FormMantenimientos, ListaEquipos, ListaUsuarios, GestionMantenimiento, FormAreas, FormTipos } from '../pages/';
import {ProtectedRoute} from './ProtectedRoute';
import {LoginRoute} from './LoginRoute';
import { FormList } from '@/pages/ListaFormularios/FormList';
import { Checklist } from '@/components/forms/FormMantenimiento/checklist';
import { ListaMantenimientos } from '@/pages/Mantenimientos/ListaMantenimiento';
import { Listas } from '@/pages/Listas/Lista';
import { ListaCuentaDante } from '@/pages/Cuentadantes/ListaCuentaDante';
import ListaArea from '@/pages/Areas/ListaAreas';

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
                <LoginRoute>
                    <Login /> 
                </LoginRoute>
            )
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
            path: '/formularios/areas',
            element: (
                <ProtectedRoute>
                    <FormAreas />
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
            path: '/areas/lista',
            element: (
                <ProtectedRoute>
                    <ListaArea />
                </ProtectedRoute>
            ),
        },
    ]);
};

