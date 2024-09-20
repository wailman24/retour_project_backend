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
    const { user, setUser } = useStateContext();
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

    const handleViewDetails = (bonId) => {
        navigate(`/retour/${bonId}`); // Redirects to the retour page with the bon ID
    };
    const handleViewRetours = (bonId) => {
        navigate(`/retours/${bonId}`); // Redirects to the retour page with the bon ID
    };

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-5xl">
                    <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            My orders
                        </h2>

                        <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                            <div>
                                <label
                                    htmlFor="order-type"
                                    className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Select order type
                                </label>
                                <select
                                    id="order-type"
                                    className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                >
                                    <option selected>All orders</option>
                                    <option value="pre-order">Pre-order</option>
                                    <option value="transit">In transit</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <span className="inline-block text-gray-500 dark:text-gray-400">
                                {" "}
                                from{" "}
                            </span>

                            <div>
                                <label
                                    htmlFor="duration"
                                    className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Select duration
                                </label>
                                <select
                                    id="duration"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                >
                                    <option selected>this week</option>
                                    <option value="this month">
                                        this month
                                    </option>
                                    <option value="last 3 months">
                                        the last 3 months
                                    </option>
                                    <option value="last 6 months">
                                        the last 6 months
                                    </option>
                                    <option value="this year">this year</option>
                                </select>
                            </div>
                        </div>
                        {user.role_id == 1 && (
                            <button
                                onClick={toggleModal}
                                type="button"
                                className="w-full rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
                            >
                                Add return request
                            </button>
                        )}
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
                                    className="flex flex-wrap items-center gap-y-4 py-6"
                                    key={b.id}
                                >
                                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                            Bon ID:
                                        </dt>
                                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                            <a
                                                href="#"
                                                className="hover:underline"
                                            >
                                                {b.id}
                                            </a>
                                        </dd>
                                    </dl>

                                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                            Date:
                                        </dt>
                                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                            {b.date}
                                        </dd>
                                    </dl>

                                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                            Client:
                                        </dt>
                                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                            {b.distributeur}
                                        </dd>
                                    </dl>

                                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                            Status:
                                        </dt>
                                        <dd className="me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ">
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
                                                />
                                            </svg>
                                            status
                                        </dd>
                                    </dl>

                                    <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                                        {user.role_id == 1 && (
                                            <button
                                                onClick={() =>
                                                    handleViewDetails(b.id)
                                                }
                                                type="button"
                                                className="w-full rounded-lg bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 px-3 py-2 text-sm font-medium"
                                            >
                                                {"Add retours"}
                                            </button>
                                        )}

                                        <a
                                            onClick={() =>
                                                handleViewRetours(b.id)
                                            }
                                            href=""
                                            className="w-full inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                                        >
                                            details
                                        </a>
                                    </div>
                                </div>
                            ))}

                            <nav
                                className="mt-6 flex items-center justify-center sm:mt-8"
                                aria-label="Page navigation example"
                            >
                                <ul className="flex h-8 items-center -space-x-px text-sm">
                                    <li>
                                        <a
                                            href="#"
                                            className="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            <span className="sr-only">
                                                Previous
                                            </span>
                                            <svg
                                                className="h-4 w-4 rtl:rotate-180"
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
                                                    d="m15 19-7-7 7-7"
                                                />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            1
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            2
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            aria-current="page"
                                            className="z-10 flex h-8 items-center justify-center border border-primary-300 bg-primary-50 px-3 leading-tight text-primary-600 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                        >
                                            3
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            ...
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            100
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            <span className="sr-only">
                                                Next
                                            </span>
                                            <svg
                                                className="h-4 w-4 rtl:rotate-180"
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
                                                    d="m9 5 7 7-7 7"
                                                />
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
