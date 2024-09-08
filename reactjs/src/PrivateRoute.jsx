// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider.jsx";
import UserForm from "./views/Loading.jsx";
import NotFound from "./views/NotFound.jsx";
import Loading from "./views/Loading.jsx";

const PrivateRoute = ({ children, requiredRole }) => {
    const { user } = useStateContext();

    if (!user.role_id) {
        return <Loading />; // Display a loading indicator while fetching user data
    }
    if (requiredRole && user.role_id !== requiredRole) {
        // User doesn't have required role, redirect to unauthorized
        return <NotFound />;
    }

    return children;
};

export default PrivateRoute;
