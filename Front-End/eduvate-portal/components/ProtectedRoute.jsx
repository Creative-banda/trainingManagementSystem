import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { Context } from '../context/user_context';
import { useUserInfo } from '../hooks/token_hooks';
import useLogout from '../hooks/logout_user';

function ProtectedRoute({children}) {
    const {isAuthenticated} = useContext(Context);
    const {is_admin} = useUserInfo();
    const {handleLogout} = useLogout();
    if(!isAuthenticated || !is_admin) {
        handleLogout();
        return <Navigate to="/login" />
    }
 return children
}

export default ProtectedRoute