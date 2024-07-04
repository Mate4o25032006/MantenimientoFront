// ProtectedRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MantenContext } from '../Context';

export const ProtectedRoute = ({ children }) => {
    const { tokenSession } = useContext(MantenContext);

    if (!tokenSession) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

