import React, { useContext } from 'react'
import { Context } from '../../context/user_context';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(Context);
    if (!isAuthenticated) {
        return <Navigate to={"/login"} />
    }

    return children
}

export default ProtectedRoute