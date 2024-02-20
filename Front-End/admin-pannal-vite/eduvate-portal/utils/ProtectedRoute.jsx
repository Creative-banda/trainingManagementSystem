import { useState } from "react"
import {Navigate, useNavigate} from 'react-router-dom';

export default function ProtectedRoute ({children}) {
    const [authenticated, setAuthenticated] = useState(true);
    
    if (!authenticated) {
        return <Navigate to="/login" replace/>
    }
    return children
}