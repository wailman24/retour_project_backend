import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client";
import Select from "react-select";

export default function Crtretours() {
    const { user, token, setUser, setToken } = useStateContext();
    const [showAddPieceSection, setShowAddPieceSection] = useState(false);
    const [guarante, setGuarante] = useState("");
    const [name, setName] = useState("");
    const [clicked, setClicked] = useState(false);
    const [pieces, setPieces] = useState([]);
    const [retour, setRetour] = useState([]);
    const [productId, setProductId] = useState("");
    const [imei, setImei] = useState("");
    const [product, setProduct] = useState(null);
    const [bon, setBon] = useState([]);
    const [availableIssues, setAvailableIssues] = useState([]);
    const [availablePieces, setAvailablePieces] = useState([]);
    const [currentPiece, setCurrentPiece] = useState({ id: "", issues: [] });
    const [names, setNames] = useState([]);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    //const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { bonId } = useParams();
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    const handleToggleShowAddPiece = () => {
        if (product) {
            setShowAddPieceSection(!showAddPieceSection);
            axiosClient
                .get(`/pieceofproduct/${product.name_id}`)
                .then(({ data }) => {
                    const formattedOptions = data.data.map((piece) => ({
                        value: piece.id,
                        label: piece.name,
                    }));
                    console.log(product.name_id);
                    setAvailablePieces(formattedOptions);
                    setLoading(false);
                })
                .catch(handleError);
        } else {
            alert("you have to search for the product");
        }
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    useEffect(() => {
        getIssues();
        //getPieces();
    }, []);

    const getIssues = () => {
        setLoading(true);
        axiosClient
            .get("/issues")
            .then(({ data }) => {
                // Map data to format suitable for react-select
                const formattedOptions = data.data.map((issue) => ({
                    value: issue.id,
                    label: issue.description,
                }));
                setAvailableIssues(formattedOptions);
                setLoading(false);
            })
            .catch(handleError);
    };

    useEffect(() => {
        getNames();
    }, []);
    const getNames = () => {
        setLoading(true);
        axiosClient
            .get("/prodnames")
            .then(({ data }) => {
                setLoading(false);
                setNames(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getBon();
    }, []);
    const getBon = () => {
        setLoading(true);
        axiosClient
            .get(`/bons/${bonId}`)
            .then((response) => {
                setLoading(false);
                console.log("Full response from API:", response); // Log full response
                if (response.data && response.data.data) {
                    setBon(response.data.data); // Adjust according to actual data structure
                    console.log(
                        "Bon fetched successfully:",
                        response.data.data
                    );
                } else {
                    console.warn(
                        "Bon data is missing or in unexpected format:",
                        response.data
                    );
                    setBon(null); // Handle missing data gracefully
                }
            })
            .catch((err) => {
                setLoading(false);
                console.error("Error fetching bon:", err);
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    //const imeiRef = useRef();

    const fetchProductByIMEI = (ev) => {
        ev.preventDefault();
        // Check if IMEI is not empty before proceeding
        if (imei.trim() === "") {
            alert("IMEI field is empty.");
            return; // Exit the function if IMEI is empty
        }

        const payload = {
            Imei: imei,
        };
        setLoading(true);
        axiosClient
            .post("/searchbyimei", payload)
            .then(({ data }) => {
                if (data.data.length > 0) {
                    setProduct(data.data[0]); // Assuming the response is an array and you want the first product
                    setClicked(true); // Set clicked to true when a product is found
                } else {
                    setProduct(null);
                    setClicked(true); // Still set clicked to true even if no product is found
                }
            })
            .catch((err) => {
                console.error("Error fetching product by IMEI:", err);
                setProduct(null);
                setClicked(true); // Set clicked to true even if there's an error
            })
            .finally(() => {
                setLoading(false);
            });
    };
    /* 
    const getPieces = () => {
        setLoading(true);
        axiosClient
            .get(`/pieceofproduct/${product.id}`)
            .then(({ data }) => {
                const formattedOptions = data.data.map((piece) => ({
                    value: piece.id,
                    label: piece.name,
                }));
                console.log(data.data);
                setAvailablePieces(formattedOptions);
                setLoading(false);
            })
            .catch(handleError);
    }; */

    const handleError = (err) => {
        const response = err.response;
        if (response && response.status === 422) {
            setErrors(response.data.errors);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user.role_id === 1) {
            setStatus("A");
        }
    }, [user.role_id]);

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        /*   if (user.role_id === 1) {
            setStatus("A");
        } */
        console.log("Bon object:", bon);
        const productPayload = {
            dist_id: bon?.dist_id, // Use optional chaining to safely access dist_id
        };

        // Check if bon and product are defined
        if (!bon || !product) {
            alert("Bon or product is not available. Please check your input.");
            return;
        }

        // Prepare payloads
        const retourPayload = {
            guarante,
            status: status,
            name,
            pieces,
            product_id: product.id,
            bon_id: bonId,
        };

        try {
            // Update product
            await axiosClient.put(`/updateDist/${product.id}`, productPayload);
            alert("Product updated successfully!");
            // Submit retour
            const retourResponse = await axiosClient.post(
                "/retours",
                retourPayload
            );
            setRetour(retourResponse.data);
            alert("Retour submitted successfully!");

            // Reload the page once after both requests succeed
            window.location.reload();
        } catch (error) {
            console.error(
                "Error submitting retour or updating product:",
                error
            );

            // Handle specific error responses
            if (error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    alert(
                        "An error occurred while processing your request. Please try again."
                    );
                }
            } else {
                alert(
                    "An unexpected error occurred. Please check your network or server."
                );
            }
        }
    };

    const nameRef = useRef();

    const ImeiRef = useRef();
    //const distidRef = useRef();
    //add user
    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            name_id: nameRef.current.value,
            Imei: ImeiRef.current.value,

            dist_id: bon?.dist_id,
        };
        axiosClient
            .post("/products", payload)
            .then(({ data }) => {
                console.log(data);
                setIsOpen(!isOpen);
                setProduct(data.data); // Assuming the response is an array and you want the first product
                setClicked(true);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    const handleAddPiece = () => {
        if (currentPiece.id && currentPiece.issues.length > 0) {
            setPieces([...pieces, currentPiece]);
            setCurrentPiece({ id: "", issues: [] }); // Reset piece selection after adding
        } else {
            alert("Please select a piece and at least one issue.");
        }
    };

    const handlePieceChange = (selectedOption) => {
        setCurrentPiece({ ...currentPiece, id: selectedOption.value });
    };

    const handleIssueChange = (selectedOptions) => {
        setCurrentPiece({
            ...currentPiece,
            issues: selectedOptions.map((option) => option.value),
        });
    };

    const removePiece = (index) => {
        if (window.confirm("Are you sure you want to delete this piece?")) {
            setPieces(pieces.filter((_, i) => i !== index));
        }
    };

    const removeIssue = (issueId) => {
        setCurrentPiece({
            ...currentPiece,
            issues: currentPiece.issues.filter((id) => id !== issueId),
        });
    };

    const addNewProduct = () => {};

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
                    Retour {bonId}
                </h2>
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <input
                            type="search"
                            id="default-search"
                            value={imei}
                            onChange={(e) => setImei(e.target.value)}
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="IMEI"
                            required
                        />
                        <button
                            onClick={fetchProductByIMEI}
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Search
                        </button>
                    </div>
                    {product && clicked && (
                        <div className="mt-4 p-4 border rounded bg-gray-100">
                            <h3 className="text-lg font-bold text-green-500">
                                Product Found:
                            </h3>
                            <p>
                                <strong>Name:</strong> {product.name}
                            </p>
                            <p>
                                <strong>IMEI:</strong> {product.Imei}
                            </p>
                            <p>
                                <strong>Model:</strong> {product.modal}
                            </p>
                            <p>
                                <strong>Distributor:</strong>{" "}
                                {product.distributeur}
                            </p>
                        </div>
                    )}

                    {!product && clicked && (
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md"
                        >
                            Add New Product
                        </button>
                    )}

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
                                            Add Products
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
                                            <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor="Imei"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Imei
                                                    </label>
                                                    <input
                                                        ref={ImeiRef}
                                                        type="text"
                                                        name="Imei"
                                                        id="Imei"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Type product Imei"
                                                        required=""
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="role"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        name
                                                    </label>
                                                    <select
                                                        ref={nameRef}
                                                        id="modal"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    >
                                                        {names.map((m) => (
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

                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Guarante:</label>
                        <input
                            type="text"
                            value={guarante}
                            onChange={(e) => setGuarante(e.target.value)}
                            required
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    </div>

                    {/* Button to show/hide the piece section */}
                    <button
                        type="button"
                        onClick={handleToggleShowAddPiece}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        {showAddPieceSection
                            ? "Hide Add Piece Section"
                            : "Show Add Piece Section"}
                    </button>

                    {/* Conditional rendering of the piece section */}
                    {showAddPieceSection && (
                        <div className="border p-4 rounded-md mb-4">
                            <h3 className="font-bold text-lg mb-2">
                                Piece Selector
                            </h3>
                            <div className="mb-2">
                                <label className="block mb-1 font-semibold">
                                    Piece:
                                </label>
                                <Select
                                    options={availablePieces}
                                    onChange={handlePieceChange}
                                    placeholder="Select a piece"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 font-semibold">
                                    Issues:
                                </label>
                                <Select
                                    isMulti
                                    options={availableIssues}
                                    onChange={handleIssueChange}
                                    placeholder="Select issues"
                                />
                                <ul className="mt-2 list-disc pl-5">
                                    {currentPiece.issues.map((issueId) => {
                                        const issue = availableIssues.find(
                                            (issue) => issue.value === issueId
                                        );
                                        return (
                                            <li
                                                key={issueId}
                                                className="flex justify-between items-center mb-1"
                                            >
                                                {issue
                                                    ? issue.label
                                                    : `Issue ${issueId}`}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeIssue(issueId)
                                                    }
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddPiece}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Add Piece
                            </button>
                        </div>
                    )}

                    <ul className="mt-4">
                        {pieces.map((piece, index) => (
                            <li
                                key={index}
                                className="border p-2 rounded-md mb-2 flex justify-between items-center"
                            >
                                <span>
                                    Piece:{" "}
                                    {
                                        availablePieces.find(
                                            (p) => p.value === piece.id
                                        )?.label
                                    }
                                    , Issues:{" "}
                                    {piece.issues
                                        .map(
                                            (issueId) =>
                                                availableIssues.find(
                                                    (issue) =>
                                                        issue.value === issueId
                                                )?.label
                                        )
                                        .join(", ")}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removePiece(index)}
                                    className="ml-4 bg-red-500 text-white px-2 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
                    >
                        Submit
                    </button>
                    {errors && (
                        <div className="error-messages mt-4">
                            {Object.entries(errors).map(([key, value]) => (
                                <p key={key} className="text-red-500">
                                    {`${key}: ${value.join(", ")}`}
                                </p>
                            ))}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}
