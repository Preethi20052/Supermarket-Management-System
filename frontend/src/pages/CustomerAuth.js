import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";

function CustomerAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                const response = await authService.login({
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate("/customer");
            } else {
                await authService.signup(formData);
                alert("Registration successful! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ background: "linear-gradient(to right, #232f3e, #131921)" }}
        >
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center mb-4 fw-bold text-dark">
                    {isLogin ? "Customer Login" : "Sign Up"}
                </h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Full Name"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control"
                                    placeholder="Phone Number"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    placeholder="Address"
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email Address"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-warning w-100 fw-bold">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-3">
                    {isLogin ? "New here? " : "Already have an account? "}
                    <span
                        className="text-primary"
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                    >
                        {isLogin ? "Create an account" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default CustomerAuth;
