import React, {useEffect} from "react";
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const getAccessToken = () => {
    return localStorage.getItem('token');
}

const getUserID = () => {
    return localStorage.getItem('userID');
}

const isAuthenticated = () => {
    return !!getAccessToken();
}

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const user_id = getUserID();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login", { replace: true });
        } else if (!window.location.pathname.startsWith("/chat")) {
            // Programmatically navigate to the chat page
            navigate('/chat/', { replace: true });
        }
    }, [navigate, user_id]);

    if (!isAuthenticated()) {
        return null; // To prevent flashing of content before navigation happens
    }

    return <Outlet context={{ user_id }} />;
}

export default ProtectedRoute