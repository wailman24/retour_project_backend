import { useRef, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useNavigate } from "react-router-dom";
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

export default function Bons() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const navigate = useNavigate();
    //modal
    const { setUser } = useStateContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenU, setIsOpenU] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    const toggleUpdateModal = (d) => {
        setIsOpenU(!isOpenU);
        setbonUpdate(d);
    };

    ///
    const [dists, setDists] = useState([]);

    /*     const itemsPerPage = 10; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination boundaries
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const nextPage = () => {
        if (currentPage < Math.ceil(users.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }; */

    //search
    const [search_name, setSearch_name] = useState("");
    const [search_email, setSearch_email] = useState("");
    const [search_location, setSearch_location] = useState("");
    const [search_date, setSearch_date] = useState("");

    const [bons, setBons] = useState([]);
    useEffect(() => {
        getBons();
    }, []);

    const getBons = () => {
        setLoading(true);
        axiosClient
            .get("/bons")
            .then(({ data }) => {
                setLoading(false);
                setBons(data.data);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };
    useEffect(() => {
        getDist();
    }, []);
    const getDist = () => {
        setLoading(true);
        axiosClient
            .get("/distributeurs")
            .then(({ data }) => {
                setLoading(false);
                setDists(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const distidRef = useRef();

    //add user
    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            dist_id: distidRef.current.value,
        };
        axiosClient
            .post("/bons", payload)
            .then((response) => {
                const bonId = response.data.data.id; // Extracting id from response
                if (bonId) {
                    navigate(`/retour/${bonId}`);
                } else {
                    console.error("bonId not found in response");
                }
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    //// DELETE USER
    const [DeleteBon, setDeleteBon] = useState({
        id: null,
        location: "",
        user_id: "",
    });
    const [isOpenD, setIsOpenD] = useState(false);

    const openDeleteModal = (d) => {
        setIsOpenD(!isOpenD);
        setDeleteBon(d);
    };

    const handleDelete = () => {
        axiosClient.delete(`/bons/${DeleteBon.id}`).then(() => {
            setIsOpenD(!isOpenD);
            window.location.reload();
        });
    };

    //UPDATE USER

    const [bonUpdate, setbonUpdate] = useState({
        id: null,
        location: "",
        user_id: "",
    });

    const onUpdate = (ev) => {
        ev.preventDefault();
        axiosClient
            .put(`/bons/${bonUpdate.id}`, bonUpdate)
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

    const handleViewDetails = (bonId) => {
        navigate(`/retour/${bonId}`); // Redirects to the retour page with the bon ID
    };

    return (
        <section className=" dark:bg-gray-900 mt-20">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-5xl">
                    <div className="gap-4 lg:flex lg:items-center lg:justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            My refunds
                        </h2>

                        <div className="mt-6 gap-4 space-y-4 sm:flex sm:items-center sm:space-y-0 lg:mt-0 lg:justify-end">
                            <div>
                                <label
                                    htmlFor="order-type"
                                    className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Select order type
                                </label>
                                <select
                                    id="order-type"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:w-[144px]"
                                >
                                    <option defaultValue>All orders</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="denied">Denied</option>
                                </select>
                            </div>

                            <span className="inline-block text-gray-500 dark:text-gray-400">
                                {" "}
                                from{" "}
                            </span>

                            <button
                                onClick={toggleModal}
                                type="button"
                                className="w-full rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
                            >
                                Add return request
                            </button>
                        </div>
                    </div>

                    {isOpen && (
                        <div
                            id="defaultModal"
                            tabIndex="-1"
                            aria-hidden="true"
                            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50"
                        >
                            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                                {/* Modal content */}
                                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                    {/* Modal header */}
                                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Add Distributeurs
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={toggleModal}
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
                                                Close modal
                                            </span>
                                        </button>
                                    </div>
                                    {/* Modal body */}
                                    <form onSubmit={onSubmit}>
                                        {errors && (
                                            <div className="alert">
                                                {Object.keys(errors).map(
                                                    (key) => (
                                                        <p key={key}>
                                                            {errors[key][0]}
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                        )}
                                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="role"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    client
                                                </label>
                                                <select
                                                    ref={distidRef}
                                                    id="client"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                >
                                                    {dists.map((u) => (
                                                        <option
                                                            key={u.id}
                                                            value={u.id}
                                                        >
                                                            {u.cname}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
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
                                                Add new retour
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mt-6 flow-root sm:mt-8">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {bons.map((b) => (
                                <div
                                    key={b.id}
                                    className="relative grid grid-cols-2 gap-4 py-6 sm:grid-cols-4 lg:grid-cols-5"
                                >
                                    {/* Serial Number */}
                                    <div className="col-span-2 content-center sm:col-span-4 lg:col-span-1">
                                        <a
                                            href="#"
                                            className="text-base font-semibold text-gray-900 hover:underline dark:text-white"
                                        >
                                            {b.id}
                                        </a>
                                    </div>

                                    {/* Date */}
                                    <div className="content-center">
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="h-4 w-4 text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {b.date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="content-center">
                                        <div className="flex items-center justify-end gap-2 sm:justify-start">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    Client name:{" "}
                                                </span>
                                                {b.distributeur}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto">
                                        <span className="inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                            <svg
                                                className="me-1 h-3 w-3"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                                                />
                                            </svg>
                                            going
                                        </span>
                                    </div>

                                    {/* View Details Button */}
                                    <div className="col-span-2 content-center sm:col-span-1 sm:justify-self-end">
                                        <button
                                            type="button"
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
                                            onClick={() =>
                                                handleViewDetails(b.id)
                                            } // Pass the bon ID to the function
                                        >
                                            View details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
