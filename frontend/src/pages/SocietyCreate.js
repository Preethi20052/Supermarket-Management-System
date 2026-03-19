import React, { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function SocietyCreate() {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        pincode: ""
    });
    const [inviteCode, setInviteCode] = useState("");
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post(`/societies/create?userId=${user.id}`, formData);
            setInviteCode(res.data.inviteCode);
            // Update user in localStorage since their societyId changed
            const updatedUser = { ...user, societyId: res.data.id };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            alert("Society Created Successfully! 🎉");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error creating society");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow border-0 p-4">
                            <h2 className="fw-bold mb-4 text-center">🏢 Create Society</h2>

                            {inviteCode ? (
                                <div className="text-center p-4 bg-light rounded">
                                    <h4 className="text-success fw-bold">Success!</h4>
                                    <p className="text-muted">Your society has been created.</p>
                                    <div className="my-4">
                                        <label className="text-muted small d-block">YOUR INVITE CODE</label>
                                        <h1 className="display-4 fw-bold text-primary">{inviteCode}</h1>
                                    </div>
                                    <p className="fw-bold">Share this code with your neighbors!</p>
                                    <button
                                        className="btn btn-primary w-100 mt-3"
                                        onClick={() => navigate("/society/dashboard")}
                                    >
                                        Go to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Society Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Enter society name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Address</label>
                                        <textarea
                                            name="address"
                                            className="form-control"
                                            rows="2"
                                            placeholder="Enter full address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                className="form-control"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                className="form-control"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-warning w-100 fw-bold mt-3 py-2"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating..." : "Create Society"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SocietyCreate;
