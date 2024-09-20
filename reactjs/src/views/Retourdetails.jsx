import { useRef, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import "flowbite";
import { useStateContext } from "../contexts/ContextProvider";

export default function Retourdetails() {
    const { id } = useParams();
    const [availableIssues, setAvailableIssues] = useState([]);
    const [availablePieces, setAvailablePieces] = useState([]);
    const [currentPiece, setCurrentPiece] = useState({ id: "", issues: [] });
    const [retour, setRetour] = useState([]);
    const [pieces, setPieces] = useState([]);
    const [retourpiece, setRetourpiece] = useState([]);
    const [product, setProduct] = useState([]);
    const [isOpenU, setIsOpenU] = useState(false);
    const { user, setUser } = useStateContext();
    useEffect(() => {
        const getPieces = async () => {
            try {
                const { data } = await axiosClient.get(`/pieceofretour/${id}`);
                console.log(data);

                // Group the pieces by name and collect descriptions
                const groupedPieces = data.reduce((acc, pieceissue) => {
                    if (!acc[pieceissue.name]) {
                        acc[pieceissue.name] = {
                            name: pieceissue.name,
                            descriptions: [pieceissue.description],
                        };
                    } else {
                        acc[pieceissue.name].descriptions.push(
                            pieceissue.description
                        );
                    }
                    return acc;
                }, {});
                console.log(Object.values(groupedPieces));
                setRetourpiece(Object.values(groupedPieces));
                //setLoading(false);
            } catch (err) {
                console.error(err);
                //setLoading(false);
            }
        };
        getPieces();
    }, [id]);

    useEffect(() => {
        const getProduct = () => {
            axiosClient
                .get(`/products/${id}`)
                .then(({ data }) => {
                    console.log(data.data);
                    setProduct(data.data);
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        console.log(err);
                        //setErrors(response.data.errors);
                    }
                });
        };
        getProduct();
    }, [retour.product_id]);

    useEffect(() => {
        const getRetour = async () => {
            try {
                const { data } = await axiosClient.get(`/retours/${id}`);
                console.log(data.data);
                setRetour(data.data);
                //setLoading(false);
            } catch (err) {
                console.error(err);
                //setLoading(false);
            }
        };
        getRetour();
    }, [id]);

    const getPiecesofProduct = () => {
        if (product) {
            axiosClient
                .get(`/pieceofproduct/${product.name_id}`)
                .then(({ data }) => {
                    const formattedOptions = data.data.map((piece) => ({
                        value: piece.id,
                        label: piece.name,
                    }));
                    console.log(product.name_id);
                    setAvailablePieces(formattedOptions);
                    //setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            alert("you have to search for the product");
        }
    };

    const getIssues = () => {
        //setLoading(true);
        axiosClient
            .get("/issues")
            .then(({ data }) => {
                console.log(data.data);
                // Map data to format suitable for react-select
                const formattedOptions = data.data.map((issue) => ({
                    value: issue.id,
                    label: issue.description,
                }));
                console.log(formattedOptions);
                setAvailableIssues(formattedOptions);
                //setLoading(false);
            })
            .catch((err) => {
                console.error(err);
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
    const toggleUpdateModal = (p) => {
        setIsOpenU(!isOpenU);
        setPieces([]);
    };

    const removeIssue = (issueId) => {
        setCurrentPiece({
            ...currentPiece,
            issues: currentPiece.issues.filter((id) => id !== issueId),
        });
    };

    const onUpdate = async (ev) => {
        ev.preventDefault();

        // Prepare payloads
        const retourPayload = {
            pieces,
        };
        console.log(retourPayload);
        try {
            // Submit retour
            const retourResponse = await axiosClient.put(
                `/retours/${id}`,
                retourPayload
            );
            setRetour(retourResponse.data);
            alert("Retour submitted successfully!");

            // Reload the page once after both requests succeed
            window.location.reload();
        } catch (error) {
            console.error("Error submitting retour ", error);

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

    const handlefinderetour = (id) => {
        if (user.role_id == 3) {
            const infoUpdate = {
                status: "C",
            };
            axiosClient
                .put(`/changestatus/${id}`, infoUpdate)
                .then(({ data }) => {
                    //setLoading(false);
                    console.log(data.data);
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
        //navigate("/retours");
    };

    return (
        <section className=" dark:bg-gray-900 mt-20">
            <div className="mx-auto max-w-screen-xl px-6 lg:px-6">
                <div className="bg-white dark:bg-gray-900 relative shadow-md sm:rounded-lg overflow-hidden ">
                    <div className="container mx-auto px-4 py-8">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            {/* Retour Header */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Retour Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="font-medium text-gray-500">
                                        Retour ID
                                    </h3>
                                    <p className="text-lg text-gray-900">
                                        {retour.id}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-500">
                                        Date
                                    </h3>
                                    <p className="text-lg text-gray-900">
                                        {retour.date}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-500">
                                        Status
                                    </h3>
                                    <p className="text-lg text-gray-900">
                                        {retour.status}
                                    </p>
                                </div>
                            </div>

                            {/* Pieces Section */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Pieces
                                </h3>
                                <ul className="list-disc list-inside text-gray-900">
                                    {retourpiece.map((piece) => (
                                        <li key={piece.id} className="mb-4">
                                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                                <h4 className="font-medium text-gray-500">
                                                    Piece:{" "}
                                                    <div className="font-bold text-gray-900">
                                                        {piece.name}{" "}
                                                    </div>
                                                </h4>

                                                <div className="mt-2">
                                                    <h5 className="font-medium text-gray-500">
                                                        Issues:
                                                    </h5>
                                                    <ul className="list-disc list-inside">
                                                        {piece.descriptions.map(
                                                            (desc, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="text-gray-700"
                                                                >
                                                                    {desc}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => {
                                        toggleUpdateModal();
                                        getPiecesofProduct();
                                        getIssues();
                                    }}
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
                                    Update Piece
                                </button>
                            </div>

                            {isOpenU && (
                                <div
                                    id="updateProductModal"
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
                                                    onClick={toggleUpdateModal}
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
                                            <form>
                                                <div className="border p-4 rounded-md mb-4">
                                                    <h3 className="font-bold text-lg mb-2">
                                                        Piece Selector
                                                    </h3>
                                                    <div className="mb-2">
                                                        <label className="block mb-1 font-semibold">
                                                            Piece:
                                                        </label>
                                                        <Select
                                                            options={
                                                                availablePieces
                                                            }
                                                            onChange={
                                                                handlePieceChange
                                                            }
                                                            placeholder="Select a piece"
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="block mb-1 font-semibold">
                                                            Issues:
                                                        </label>
                                                        <Select
                                                            isMulti
                                                            options={
                                                                availableIssues
                                                            }
                                                            onChange={
                                                                handleIssueChange
                                                            }
                                                            placeholder="Select issues"
                                                        />
                                                        <ul className="mt-2 list-disc pl-5">
                                                            {currentPiece.issues.map(
                                                                (issueId) => {
                                                                    const issue =
                                                                        availableIssues.find(
                                                                            (
                                                                                issue
                                                                            ) =>
                                                                                issue.value ===
                                                                                issueId
                                                                        );
                                                                    return (
                                                                        <li
                                                                            key={
                                                                                issueId
                                                                            }
                                                                            className="flex justify-between items-center mb-1"
                                                                        >
                                                                            {issue
                                                                                ? issue.label
                                                                                : `Issue ${issueId}`}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeIssue(
                                                                                        issueId
                                                                                    )
                                                                                }
                                                                                className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </li>
                                                                    );
                                                                }
                                                            )}
                                                        </ul>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddPiece}
                                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                                                    >
                                                        Add Piece
                                                    </button>
                                                    <ul className="mt-4">
                                                        {pieces.map(
                                                            (piece, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="border p-2 rounded-md mb-2 flex justify-between items-center"
                                                                >
                                                                    <span>
                                                                        Piece:{" "}
                                                                        {
                                                                            availablePieces.find(
                                                                                (
                                                                                    p
                                                                                ) =>
                                                                                    p.value ===
                                                                                    piece.id
                                                                            )
                                                                                ?.label
                                                                        }
                                                                        ,
                                                                        Issues:{" "}
                                                                        {piece.issues
                                                                            .map(
                                                                                (
                                                                                    issueId
                                                                                ) =>
                                                                                    availableIssues.find(
                                                                                        (
                                                                                            issue
                                                                                        ) =>
                                                                                            issue.value ===
                                                                                            issueId
                                                                                    )
                                                                                        ?.label
                                                                            )
                                                                            .join(
                                                                                ", "
                                                                            )}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removePiece(
                                                                                index
                                                                            )
                                                                        }
                                                                        className="ml-4 bg-red-500 text-white px-2 py-1 rounded-md"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
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
                                                        Update Piece
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:text-white hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                                        /* onClick={(ev) =>
                                                openDeleteModal(productUpdate)
                                            } */
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
                            {/* Status Timeline */}
                            {user.role_id != 3 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Status Timeline
                                    </h3>
                                    <ol className="relative border-l border-gray-200 dark:border-gray-700">
                                        {/* First event */}
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
                                                    Products have been added to
                                                    the retour.
                                                </p>
                                            </div>
                                        </li>

                                        {/* Second event */}
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
                                                    Retour date has been
                                                    selected.
                                                </p>
                                            </div>
                                        </li>

                                        {/* Final event */}
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
                                                <p className="text-base font-normal text-gray-500">
                                                    Retour confirmed
                                                    successfully.
                                                </p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            )}

                            {/* Back to Retours Button */}
                            <div className="mt-6 flex justify-end">
                                <a
                                    onClick={handlefinderetour}
                                    href=""
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    fin de Retours
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
