import React from "react";
import ReactDOM from "react-dom/client";
//import App from "./App.tsx";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "../../reactjs/src/router.jsx";
import { ContextProvider } from "./contexts/ContextProvider.jsx";
import "flowbite";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    </React.StrictMode>
);
