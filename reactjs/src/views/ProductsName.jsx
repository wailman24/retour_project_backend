import { useRef, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import "flowbite";
import { useStateContext } from "../contexts/ContextProvider";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";

export default function ProductsName() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    //piece
    const { setUser } = useStateContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenU, setIsOpenU] = useState(false);

    const togglePiece = () => {
        setIsOpen(!isOpen);
    };
    const toggleUpdatePiece = (d) => {
        setIsOpenU(!isOpenU);
        setPieceUpdate(d);
    };

    ///
    const [modals, setModals] = useState([]);

    const [prods, setProds] = useState([]);
    useEffect(() => {
        getProds();
    }, []);

    const getProds = (page = 1) => {
        setLoading(true);
        axiosClient
            .get(`/prodnames`)
            .then(({ data }) => {
                console.log("API Response:", data.data); // For debugging
                setProds(data.data); // Set the modals for the current page
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.error(err);
            });
    };
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = prods.slice(firstIndex, lastIndex);
    const npage = Math.ceil(prods.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    function prePage() {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    function changeCPage(id) {
        setCurrentPage(id);
    }
    function nextPage() {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    }
    //search
    const [search_name, setSearch_name] = useState("");
    const [search_modal, setSearch_modal] = useState("");
    const [search_date, setSearch_date] = useState("");

    useEffect(() => {
        getModals();
    }, []);

    const getModals = () => {
        setLoading(true);
        axiosClient
            .get("/modals")
            .then(({ data }) => {
                setLoading(false);
                setModals(data.data);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    const nameRef = useRef();
    const modalidRef = useRef();

    //add user
    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            name: nameRef.current.value,
            modal_id: modalidRef.current.value,
        };
        axiosClient
            .post("/prodnames", payload)
            .then(() => {
                setIsOpen(!isOpen);
                window.location.reload();
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    //// DELETE USER
    const [DeleteProd, setDeleteProd] = useState({
        id: null,
        name: "",
        modal_id: "",
    });
    const [isOpenD, setIsOpenD] = useState(false);

    const openDeletePiece = (d) => {
        setIsOpenD(!isOpenD);
        setDeleteProd(d);
    };

    const handleDelete = () => {
        axiosClient.delete(`/prodnames/${DeleteProd.id}`).then(() => {
            setIsOpenD(!isOpenD);
            window.location.reload();
        });
    };

    //UPDATE USER

    const [prodUpdate, setProdUpdate] = useState({
        id: null,
        name: "",
        modal_id: "",
    });

    const onUpdate = (ev) => {
        ev.preventDefault();
        axiosClient
            .put(`/prodnames/${prodUpdate.id}`, prodUpdate)
            .then(() => {
                setIsOpenU(!isOpenU);
                window.location.reload();
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    return (
        <section className=" dark:bg-gray-900 mt-20">
            <div className="mx-auto max-w-screen-xl px-6 lg:px-6">
                <div className="bg-white dark:bg-gray-900 relative shadow-md sm:rounded-lg overflow-hidden ">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="flex items-center flex-1 space-x-4">
                            <h5>
                                <span class="text-gray-500">All Pieces:</span>
                                <span class="dark:text-white">
                                    {prods.length}
                                </span>
                            </h5>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <button
                                onClick={togglePiece}
                                type="button"
                                className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <svg
                                    className="h-4 w-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    />
                                </svg>
                                Add Products
                            </button>
                            {/* Main Piece */}
                            {isOpen && (
                                <div
                                    id="defaultPiece"
                                    tabIndex="-1"
                                    aria-hidden="true"
                                    className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50"
                                >
                                    <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                                        {/* Piece content */}
                                        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                            {/* Piece header */}
                                            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Add Products
                                                </h3>
                                                <button
                                                    type="button"
                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                    onClick={togglePiece}
                                                >
                                                    <svg
                                                        aria-hidden="true"
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </svg>
                                                    <span className="sr-only">
                                                        Close Piece
                                                    </span>
                                                </button>
                                            </div>
                                            {/* Piece body */}
                                            <form onSubmit={onSubmit}>
                                                {errors && (
                                                    <div className="alert">
                                                        {Object.keys(
                                                            errors
                                                        ).map((key) => (
                                                            <p key={key}>
                                                                {errors[key][0]}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                                    <div>
                                                        <label
                                                            htmlFor="name"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            name
                                                        </label>
                                                        <input
                                                            ref={nameRef}
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            placeholder="Type client location"
                                                            required=""
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="product"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Modal
                                                    </label>
                                                    <select
                                                        ref={modalidRef}
                                                        id="product"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    >
                                                        <option selected="">
                                                            Select Modal
                                                        </option>
                                                        {modals.map((r) => (
                                                            <option
                                                                key={r.id}
                                                                value={r.id}
                                                            >
                                                                {r.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="border-t border-gray-300 dark:border-gray-600 mt-4 pt-4">
                                                    <button
                                                        onClick={onSubmit}
                                                        type="submit"
                                                        className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
                                                    >
                                                        <svg
                                                            className="mr-1 -ml-1 w-6 h-6"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                        Add new Products
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isOpenU && (
                                <div
                                    id="updateProductPiece"
                                    tabIndex="-1"
                                    aria-hidden="true"
                                    className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75"
                                >
                                    <div className="relative w-full h-full max-w-2xl p-4 md:h-auto">
                                        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                            <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5 dark:border-gray-600">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Update Piece
                                                </h3>
                                                <button
                                                    type="button"
                                                    className="p-1.5 ml-auto text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    onClick={toggleUpdatePiece}
                                                >
                                                    <svg
                                                        aria-hidden="true"
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </svg>
                                                    <span className="sr-only">
                                                        Close Piece
                                                    </span>
                                                </button>
                                            </div>
                                            <form>
                                                {errors && (
                                                    <div className="alert">
                                                        {Object.keys(
                                                            errors
                                                        ).map((key) => (
                                                            <p key={key}>
                                                                {errors[key][0]}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                                    <div>
                                                        <label
                                                            htmlFor="name"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            value={
                                                                prodUpdate.name
                                                            }
                                                            onChange={(ev) =>
                                                                setProdUpdate({
                                                                    ...prodUpdate,
                                                                    name: ev
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="modal"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Modal
                                                        </label>
                                                        <select
                                                            id="modal"
                                                            onChange={(ev) =>
                                                                setProdUpdate({
                                                                    ...prodUpdate,
                                                                    modal_id:
                                                                        ev
                                                                            .target
                                                                            .value,
                                                                })
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        >
                                                            <option /* selected="" */
                                                            >
                                                                Select modal
                                                            </option>
                                                            {modals.map((m) => (
                                                                <option
                                                                    key={m.id}
                                                                    value={m.id}
                                                                >
                                                                    {m.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        onClick={onUpdate}
                                                        type="submit"
                                                        className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
                                                    >
                                                        <svg
                                                            className="mr-1 -ml-1 w-6 h-6"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                        Update Product
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:text-white hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                                        onClick={(ev) =>
                                                            openDeletePiece(
                                                                prodUpdate
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            className="w-5 h-5 mr-1 -ml-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isOpenD && (
                                <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50">
                                    <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                                        <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                            <button
                                                type="button"
                                                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={openDeletePiece}
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                                <span className="sr-only">
                                                    Close Piece
                                                </span>
                                            </button>
                                            <svg
                                                className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                                                aria-hidden="true"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            <p className="mb-4 text-gray-500 dark:text-gray-300">
                                                Are you sure you want to delete
                                                this item?
                                            </p>
                                            <div className="flex justify-center items-center space-x-4">
                                                <button
                                                    type="button"
                                                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                                    onClick={openDeletePiece}
                                                >
                                                    No, cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    onClick={handleDelete}
                                                    className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                                                >
                                                    Yes, I'm sure
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className=" md:w-35">
                            <form class="max-w-xs mx-auto">
                                <div class="relative">
                                    <span class="absolute start-0 bottom-3 text-gray-500 dark:text-gray-400">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        id="floating-phone-number"
                                        class="block py-2.5 ps-6 pe-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder="  Product name"
                                        onChange={(e) =>
                                            setSearch_name(e.target.value)
                                        }
                                    />
                                </div>
                            </form>
                        </div>
                        <div className=" md:w-35">
                            <form class="max-w-xs mx-auto">
                                <div class="relative">
                                    <span class="absolute start-0 bottom-3 text-gray-500 dark:text-gray-400">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        id="floating-phone-number"
                                        class="block py-2.5 ps-6 pe-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder="  modal name"
                                        onChange={(e) =>
                                            setSearch_modal(e.target.value)
                                        }
                                    />
                                </div>
                            </form>
                        </div>
                        <div className=" md:w-35">
                            <form class="max-w-xs mx-auto">
                                <div class="relative">
                                    <span class="absolute start-0 bottom-3 text-gray-500 dark:text-gray-400">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        id="floating-phone-number"
                                        class="block py-2.5 ps-6 pe-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder="  date"
                                        onChange={(e) =>
                                            setSearch_date(e.target.value)
                                        }
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">
                                        Product name
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Modal name
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        created_at
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            {loading && (
                                <tbody>
                                    <tr>
                                        <td colSpan="5" class="text-center">
                                            <button
                                                disabled
                                                type="button"
                                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    role="status"
                                                    class="inline w-4 h-4 me-3 text-white animate-spin"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="#E5E7EB"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                Loading...
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                            {!loading && (
                                <tbody>
                                    {records
                                        .filter((d) => {
                                            return search_name.toLowerCase() ===
                                                ""
                                                ? d
                                                : d.name
                                                      .toLowerCase()
                                                      .includes(search_name);
                                        })
                                        .filter((d) => {
                                            return search_modal.toLowerCase() ===
                                                ""
                                                ? d
                                                : d.modal
                                                      .toLowerCase()
                                                      .includes(search_modal);
                                        })
                                        .filter((d) => {
                                            if (
                                                typeof search_date ===
                                                    "string" &&
                                                search_date.trim() !== ""
                                            ) {
                                                return d.created_at?.includes(
                                                    search_date
                                                );
                                            } else {
                                                return true;
                                            }
                                        })
                                        .map((d) => (
                                            <tr
                                                className="border-b dark:border-gray-700"
                                                key={d.id}
                                            >
                                                <th
                                                    scope="row"
                                                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {d.name}
                                                </th>
                                                <th
                                                    scope="row"
                                                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {d.modal}
                                                </th>
                                                <td className="px-4 py-3">
                                                    {d.created_at}
                                                </td>
                                                <td>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <button
                                                                id="apple-imac-27-dropdown-button"
                                                                data-dropdown-toggle="apple-imac-27-dropdown"
                                                                class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                                                type="button"
                                                            >
                                                                <svg
                                                                    class="w-5 h-5"
                                                                    aria-hidden="true"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                </svg>
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            id="apple-imac-27-dropdown"
                                                            className=" z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                                        >
                                                            <ul
                                                                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                                aria-labelledby="apple-imac-27-dropdown-button"
                                                            >
                                                                <DropdownMenuItem>
                                                                    <a
                                                                        href="#"
                                                                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    >
                                                                        Show
                                                                    </a>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <a
                                                                        onClick={(
                                                                            ev
                                                                        ) =>
                                                                            toggleUpdatePiece(
                                                                                d
                                                                            )
                                                                        }
                                                                        href="#"
                                                                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    >
                                                                        Edit
                                                                    </a>
                                                                </DropdownMenuItem>
                                                            </ul>
                                                            <div className="py-1">
                                                                <DropdownMenuItem>
                                                                    <a
                                                                        onClick={(
                                                                            ev
                                                                        ) =>
                                                                            openDeletePiece(
                                                                                d
                                                                            )
                                                                        }
                                                                        href="#"
                                                                        className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                                                    >
                                                                        Delete
                                                                    </a>
                                                                </DropdownMenuItem>
                                                            </div>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            )}
                        </table>
                        {/* <nav>
                            <ul className="pagination">
                                <li className="page-item">
                                    <a
                                        href="#"
                                        className="page-link"
                                        onClick={prePage}
                                    >
                                        Prev
                                    </a>
                                </li>
                                {numbers.map((n, i) => (
                                    <li
                                        className={`page-item ${
                                            currentPage === n ? "active" : ""
                                        }`}
                                        key={i}
                                    >
                                        <a
                                            href="#"
                                            className="page-link"
                                            onClick={() => changeCPage(n)}
                                        >
                                            {n}
                                        </a>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <a
                                        href="#"
                                        className="page-link"
                                        onClick={nextPage}
                                    >
                                        Next
                                    </a>
                                </li>
                            </ul>
                        </nav> */}

                        <nav className="flex justify-center mt-4 mb-4">
                            <ul className="inline-flex items-center space-x-2">
                                <li>
                                    <a
                                        href="#"
                                        className={`px-3 py-1 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 ${
                                            currentPage === 1
                                                ? "cursor-not-allowed opacity-50"
                                                : ""
                                        }`}
                                        onClick={prePage}
                                    >
                                        Prev
                                    </a>
                                </li>
                                {numbers.map((n, i) => (
                                    <li key={i}>
                                        <a
                                            href="#"
                                            className={`px-3 py-1 border rounded-md ${
                                                currentPage === n
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                            }`}
                                            onClick={() => changeCPage(n)}
                                        >
                                            {n}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a
                                        href="#"
                                        className={`px-3 py-1 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 ${
                                            currentPage === npage
                                                ? "cursor-not-allowed opacity-50"
                                                : ""
                                        }`}
                                        onClick={nextPage}
                                    >
                                        Next
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    );
}
