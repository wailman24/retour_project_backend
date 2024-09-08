import { useState } from "react";

import { useEffect, useRef } from "react";

export function useClickOutside(callbackFn) {
    let domNodeRef = useRef();

    useEffect(() => {
        let handler = (event) => {
            if (!domNodeRef.current?.contains(event.target)) {
                callbackFn();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);
    return domNodeRef;
}

export default function DropDownUser({ children }) {
    const [show, setShow] = useState(false);
    const dropRef = useClickOutside(() => setShow(false));

    return (
        <div
            className="w-fit relative"
            ref={dropRef}
            onClick={() => setShow((curr) => !curr)}
        >
            <div>
                <button
                    type="button"
                    class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                >
                    <span class="sr-only">Open user menu</span>
                    <img
                        class="w-8 h-8 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="user photo"
                    />
                </button>
            </div>
            <div></div>
            {show && (
                <ul className="min-w-max absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow overflow-hidden">
                    {children}
                </ul>
            )}
        </div>
    );
}

export function DropdownItem({ children }) {
    return (
        <ul
            className="py-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="apple-imac-27-dropdown-button"
        >
            <li className="flex gap-3 items-center px-4 py-2 text-gray-800 hover:bg-gray-50 cursor-pointer">
                {children}
            </li>
        </ul>
    );
}
