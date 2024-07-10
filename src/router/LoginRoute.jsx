// ProtectedRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MantenContext } from '../Context';

//Verificamos si existe el Token, y en caso de que no, volvemos al Login
export const LoginRoute = ({ children }) => {
    const { tokenSession } = useContext(MantenContext);

    if (tokenSession) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

