import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
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

        // Admin Hardcoded Check REMOVED - Using Database Role

        try {
            if (isLogin) {
                const response = await authService.login({
                    email: formData.email,
                    password: formData.password
                });

                // Assume backend returns user object with role
                const user = response.data;
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("role", user.role || "CUSTOMER");

                if (user.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/customer");
                }

            } else {
                await authService.signup(formData);
                alert("Registration successful! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid Credentials");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ background: "linear-gradient(to right, #232f3e, #131921)" }}
        >
            <div className="card p-4 shadow-lg text-center" style={{ width: "400px" }}>
                <h2 className="mb-4 fw-bold text-dark">
                    Login
                </h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
