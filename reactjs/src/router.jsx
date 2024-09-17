import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users.jsx";
import UserForm from "./views/Loading.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Home from "./views/Home.jsx";
import Modals from "./views/Modals.jsx";
import Products from "./views/Products.jsx";
import Distributeurs from "./views/Distributeurs.jsx";
import Pieces from "./views/Pieces.jsx";
import Issues from "./views/Issues.jsx";
import MagazPieces from "./views/MagazPieces.jsx";
import Stocks from "./views/Stocks.jsx";
import Bons from "./views/Bons.jsx";
import Crtretours from "./views/Crtretours.jsx";
import ProductsName from "./views/ProductsName.jsx";
import Retours from "./views/Retours.jsx";
import Retourdetails from "./views/Retourdetails.jsx";
//import UserForm from "./views/UserForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/home" />,
            },
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: "/unauthorized",
                element: <NotFound />,
            },
            {
                path: "/dashboard",
                element: (
                    <PrivateRoute requiredRole={1}>
                        <Dashboard />
                    </PrivateRoute>
                ),
            },
            {
                path: "/users",
                element: (
                    <PrivateRoute requiredRole={1}>
                        <Users />
                    </PrivateRoute>
                ),
            },
            {
                path: "/distributeurs",
                element: (
                    <PrivateRoute requiredRole={1}>
                        <Distributeurs />
                    </PrivateRoute>
                ),
            },
            {
                path: "/modals",
                element: (
                    <PrivateRoute requiredRole={1}>
                        <Modals />
                    </PrivateRoute>
                ),
            },
            {
                path: "/prodnames",
                element: (
                    <PrivateRoute requiredRole={1}>
                        <ProductsName />
                    </PrivateRoute>
                ),
            },
            {
                path: "/products",
                element: (
                    <PrivateRoute requiredRole={1}>
                        <Products />
                    </PrivateRoute>
                ),
            },
            {
                path: "/stocks",
                element: (
                    //<PrivateRoute requiredRole={1}>
                    <Stocks />
                    //</PrivateRoute>
                ),
            },
            {
                path: "/pieces",
                element: (
                    <PrivateRoute requiredRole={1}>
                        <Pieces />
                    </PrivateRoute>
                ),
            },
            {
                path: "/magazin",
                element: (
                    //<PrivateRoute requiredRole={1}>
                    <MagazPieces />
                    //</PrivateRoute>
                ),
            },

            {
                path: "/issues",
                element: (
                    <PrivateRoute requiredRole={1}>
                        <Issues />
                    </PrivateRoute>
                ),
            },
            {
                path: "/bons",
                element: (
                    //<PrivateRoute requiredRole={1}>
                    <Bons />
                    //</PrivateRoute>
                ),
            },

            {
                path: "/retours/:bonId",
                element: (
                    //<PrivateRoute requiredRole={1}>
                    <Retours />
                    //</PrivateRoute>
                ),
            },
            {
                path: "/retours",
                element: (
                    //<PrivateRoute requiredRole={1}>
                    <Retours />
                    //</PrivateRoute>
                ),
            },
            {
                path: "/details/:id",
                element: (
                    //<PrivateRoute requiredRole={1}>
                    <Retourdetails />
                    //</PrivateRoute>
                ),
            },
            {
                path: "/retour/:bonId",
                element: (
                    //<PrivateRoute requiredRole={1}>
                    <Crtretours />
                    //</PrivateRoute>
                ),
            },
            {
                path: "/users/:id",
                //element: <UserForm key="userUpdate" />,
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
]);

export default router;
