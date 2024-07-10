// routes.js
import { useRoutes } from 'react-router-dom';
import { Login, HomePage, FormUsuarios, FormEquipos, FormRoles, FormPropietarios, FormMantenimientos, ListaEquipos, ListaUsuarios } from '../pages/';
import {ProtectedRoute} from './ProtectedRoute';
import { FormList } from '@/pages/ListaFormularios/FormList';
import { Checklist } from '@/components/forms/FormMantenimiento/checklist';

export const AppRoutes = () => {
    return useRoutes([
        { path: '/', element: <Login /> },
        { path: '/login', element: <Login /> },
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
            path: '/formularios/propietarios',
            element: (
                <ProtectedRoute>
                    <FormPropietarios />
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
    ]);
};

