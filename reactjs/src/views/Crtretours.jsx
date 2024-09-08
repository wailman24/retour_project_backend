import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client";
import Select from "react-select";

export default function Crtretours() {
    const { user, token, setUser, setToken } = useStateContext();

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
    const [errors, setErrors] = useState({});
    const [status, useStatus] = useState("");
    //const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { bonId } = useParams();
    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    useEffect(() => {
        getIssues();
        getPieces();
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

    const getPieces = () => {
        setLoading(true);
        axiosClient
            .get("/pieces")
            .then(({ data }) => {
                const formattedOptions = data.data.map((piece) => ({
                    value: piece.id,
                    label: piece.name,
                }));
                setAvailablePieces(formattedOptions);
                setLoading(false);
            })
            .catch(handleError);
    };

    useEffect(() => {
        getBon();
    }, []);

    const getBon = () => {
        setLoading(true);
        axiosClient
            .get(`/bons/${bonId}`)
            .then(({ data }) => {
                setLoading(false);
                setBon(data.data);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    //const imeiRef = useRef();

    const fetchProductByIMEI = (ev) => {
        ev.preventDefault();
        const payload = {
            Imei: imei,
        };
        setLoading(true);
        axiosClient
            .post("/searchbyimei", payload)
            .then(({ data }) => {
                if (data.data.length > 0) {
                    setProduct(data.data[0]); // Assuming an array is returned and you want the first product
                    setClicked(true);
                } else {
                    setProduct(null);
                }
            })
            .catch((err) => {
                console.error("Error fetching product by IMEI:", err);
                setProduct(null);
            });
    };

    const handleError = (err) => {
        const response = err.response;
        if (response && response.status === 422) {
            setErrors(response.data.errors);
        }
        setLoading(false);
    };

    const [productUpdate, setproductUpdate] = useState({
        dist_id: bon.dist_id,
    });

    const handleSubmit = (ev) => {
        if (user.role_id == 1) {
            useStatus("A");
        }
        ev.preventDefault();
        const payload = {
            guarante,
            status: status,
            name,
            pieces,
            product_id: product.id,
            bon_id: bonId,
        };
        console.log(payload);
        axiosClient
            .post("/retours", payload)
            .then((data) => {
                setRetour(data.data);
                alert("Retour submitted successfully!");
                window.location.reload();
            })
            .catch(handleError);

        axiosClient
            .put(`/products/${product.id}`, product)
            .then(() => {
                //setIsOpenU(!isOpenU);
                window.location.reload();
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
                    {/* <div className="flex flex-col">
                        <label className="mb-2 font-semibold">IMEI:</label>
                        <input
                            type="text"
                            //ref={imeiRef}
                            onChange={(e) => setImei(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full"
                            placeholder="Enter IMEI"
                        />
                        <button
                            type="button"
                            onClick={fetchProductByIMEI}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                            disabled={loading || !imei}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>

                        {error && <p className="mt-2 text-red-500">{error}</p>}

                        {product ? (
                            <p className="mt-2 text-green-500">
                                Product Found: {product.name}
                            </p>
                        ) : (
                            imei &&
                            !loading &&
                            !product && (
                                <button
                                    type="button"
                                    onClick={addNewProduct}
                                    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md"
                                >
                                    Add New Product
                                </button>
                            )
                        )}
                    </div> */}
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
                            onClick={() => console.log("Add new product")}
                            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md"
                        >
                            Add New Product
                        </button>
                    )}

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
