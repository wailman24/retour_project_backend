import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client";

export default function MagazPieces() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [pieces, setPieces] = useState([]);
    const [products, setProducts] = useState([]);
    const pcnameRef = useRef();
    const productRef = useRef();
    const qteRef = useRef();

    useEffect(() => {
        getPieces();
    }, []);

    const getPieces = () => {
        setLoading(true);
        axiosClient
            .get("/pieces")
            .then(({ data }) => {
                setPieces(data.data);
                setLoading(false);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
                setLoading(false);
            });
    };

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = () => {
        setLoading(true);
        axiosClient
            .get("/prodnames")
            .then(({ data }) => {
                setProducts(data.data);
                setLoading(false);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
                setLoading(false);
            });
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            piece_id: pcnameRef.current.value,
            quantity: qteRef.current.value,
        };

        console.log(payload);
        axiosClient
            .post("/decrement", payload)
            .then(() => {
                //window.location.reload();
            })
            .catch((err) => {
                const response = err.response;

                if (response && response.status === 422) {
                    console.error(response.data.errors);
                    setErrors(response.data.errors);
                }
            });

        console.log(payload);
        axiosClient
            .post("/magazines", payload)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                const response = err.response;

                if (response && response.status === 422) {
                    console.error(response.data.errors);
                    setErrors(response.data.errors);
                }
            });
    };

    return (
        <>
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
                        Stock Out
                    </h2>
                    <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl"></p>
                    <form className="space-y-8">
                        <div>
                            <label
                                htmlFor="product"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                product
                            </label>
                            <select
                                ref={productRef}
                                id="product"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option selected="">Select product</option>
                                {products.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Name
                            </label>
                            <select
                                ref={pcnameRef}
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option selected="">Select name</option>
                                {pieces.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="quantity"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Quantity
                            </label>
                            <input
                                ref={qteRef}
                                type="number"
                                name="quantity"
                                id="quantity"
                                className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Enter quantity"
                            />
                        </div>
                        <div className="border-t border-gray-300 dark:border-gray-600 mt-4 pt-4">
                            <button
                                onClick={onSubmit}
                                type="submit"
                                className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <svg
                                    className="w-6 h-6 text-white dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13V1m0 0L1 5m4-4 4 4"
                                    />
                                </svg>
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
