import { useRef, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import "flowbite";
import { useStateContext } from "../contexts/ContextProvider";

export default function Retourdetails() {
    const { id } = useParams();
    const [retour, setRetour] = useState([]);

    const getRetour = () => {
        axiosClient
            .get(`/retours/${id}`)
            .then(({ data }) => {
                setLoading(false);
                setRetour(data.data);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    //setErrors(response.data.errors);
                }
            });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
                {/* Retour Details Section */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Retour Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="font-medium text-gray-500">Retour ID</h3>
                        <p className="text-lg text-gray-900">{retour.id}</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-500">Date</h3>
                        <p className="text-lg text-gray-900">{retour.date}</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-500">Status</h3>
                        <p className="text-lg text-gray-900">{retour.status}</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-500">Products</h3>
                        <ul className="text-gray-900 list-disc list-inside">
                            {/* {retour.products.map((product) => (
                                <li key={product.id}>{product.name}</li>
                            ))} */}
                        </ul>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Status Timeline
                    </h3>
                    <ol className="relative border-l border-gray-200 dark:border-gray-700">
                        <li className="mb-10 ml-6">
                            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-primary-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
                                <svg
                                    className="w-3 h-3 text-primary-600 dark:text-primary-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.707a1 1 0 00-1.414 0L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-gray-900">
                                    Product Added
                                </h3>
                                <time className="block mb-2 text-sm font-normal text-gray-400">
                                    {retour.date}
                                </time>
                                <p className="text-base font-normal text-gray-500">
                                    Products have been added to the retour.
                                </p>
                            </div>
                        </li>

                        <li className="mb-10 ml-6">
                            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full ring-8 ring-white dark:ring-gray-900">
                                <svg
                                    className="w-3 h-3 text-gray-600 dark:text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.707a1 1 0 00-1.414 0L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-gray-900">
                                    Date Selected
                                </h3>
                                <time className="block mb-2 text-sm font-normal text-gray-400">
                                    {retour.date}
                                </time>
                                <p className="text-base font-normal text-gray-500">
                                    Retour date has been selected.
                                </p>
                            </div>
                        </li>

                        <li className="ml-6">
                            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full ring-8 ring-white dark:ring-gray-900">
                                <svg
                                    className="w-3 h-3 text-gray-600 dark:text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.707a1 1 0 00-1.414 0L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-gray-900">
                                    Confirmation
                                </h3>
                                <time className="block mb-2 text-sm font-normal text-gray-400">
                                    {retour.confirmation_date}
                                </time>
                                <p className="text-base font-normal text-gray-500">
                                    Retour confirmed successfully.
                                </p>
                            </div>
                        </li>
                    </ol>
                </div>

                <div className="mt-6 flex justify-end">
                    <a
                        href="/retours"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Back to Retours
                    </a>
                </div>
            </div>
        </div>
    );
}
