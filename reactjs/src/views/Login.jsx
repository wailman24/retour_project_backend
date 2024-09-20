import { useState, useRef } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState(null);
    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
                console.log(data.user);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status == 422) {
                    setErrors(response.data.errors);
                }
            });
    };
    return (
        <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
            {errors && (
                <div className="alert">
                    {Object.keys(errors).map((key) => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>
            )}
            <div className="mb-5">
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Your email
                </label>
                <input
                    type="email"
                    id="email"
                    ref={emailRef}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    //placeholder="name@flowbite.com"
                    required
                />
            </div>
            <div className="mb-5">
                <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Your password
                </label>
                <input
                    type="password"
                    id="password"
                    ref={passwordRef}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Submit
            </button>
        </form>
    );
}
