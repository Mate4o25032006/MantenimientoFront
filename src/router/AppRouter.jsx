// routes.js
import { useRoutes } from 'react-router-dom';
import { Login, HomePage, FormUsuarios, FormEquipos, FormRoles, FormPropietarios, FormMantenimientos, ListaEquipos } from '../pages/';
import {ProtectedRoute} from './ProtectedRoute';


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
            path: '/propietarios',
            element: (
                <ProtectedRoute>
                    <FormPropietarios />
                </ProtectedRoute>
            ),
        },
        {
            path: '/mantenimientos',
            element: (
                <ProtectedRoute>
                    <FormMantenimientos />
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
        
    ]);
};

