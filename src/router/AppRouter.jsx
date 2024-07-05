// routes.js
import { useRoutes } from 'react-router-dom';
import { Login, HomePage, FormUsuarios, FormEquipos, FormRoles } from '../pages/';
import {ProtectedRoute} from './ProtectedRoute';
import { ListaEquipos } from '../pages/Equipos/ListaEquipos';
import { ListaUsuarios } from '../pages/Usuarios/ListaEquipos';

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
            path: '/usuarios',
            element: (
                <ProtectedRoute>
                    <FormUsuarios />
                </ProtectedRoute>
            ),
        },
        {
            path: '/equipos',
            element: (
                <ProtectedRoute>
                    <FormEquipos />
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

