import { useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const PhoneRef = useRef();
    const passwordRef = useRef();
    const roleidRef = useRef();

    const { setUser, setToken } = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            name: nameRef.current.value,
            Phone: PhoneRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            role_id: roleidRef.current.value,
        };
        axiosClient
            .post("/signup", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status == 422) {
                    console.log(response.data.errors);
                }
            });
    };
    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title"> Signup </h1>
                    <input ref={nameRef} placeholder="Full Name" />
                    <input ref={PhoneRef} placeholder="Phone" />
                    <input ref={emailRef} type="email" placeholder="Email" />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="password"
                    />
                    <input ref={roleidRef} type="number" placeholder="Role" />
                    <button className="btn btn-block">Sign up</button>
                    <p className="message">
                        you have an account?
                        <Link to="/login"> Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
