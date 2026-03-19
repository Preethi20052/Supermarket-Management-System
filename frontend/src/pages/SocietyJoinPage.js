import React, { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function SocietyJoinPage() {
    const [inviteCode, setInviteCode] = useState("");
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleJoin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Updated to use the common api instance. 
            // Note: If backend is updated to extract user from token, userId param is redundant.
            const res = await api.post(`/societies/join?inviteCode=${inviteCode}&userId=${user.id}`);
            // Update user in localStorage
            const updatedUser = { ...user, societyId: res.data.societyId };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            alert("Joined Society Successfully! 🎉");
            navigate("/society/dashboard");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error joining society. Please check the invite code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card shadow border-0 p-4 text-center">
                            <h2 className="fw-bold mb-4">🤝 Join Society</h2>
                            <p className="text-muted mb-4">Enter the 6-character invite code shared by your society admin.</p>

                            <form onSubmit={handleJoin}>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg text-center fw-bold"
                                        style={{ letterSpacing: '5px', textTransform: 'uppercase' }}
                                        placeholder="CODE123"
                                        maxLength="6"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 fw-bold py-2 shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? "Joining..." : "Join Society"}
                                </button>
                            </form>

                            <hr className="my-4" />
                            <p className="small text-muted mb-0">Don't have a code? Ask your neighbors or create a new society.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SocietyJoinPage;
