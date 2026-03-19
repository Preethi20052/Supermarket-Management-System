import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import SocietyBulkDeals from "../components/SocietyBulkDeals";

function SocietyDashboard() {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const loadDetails = async () => {
        try {
            const res = await api.get(`/societies/my-details?userId=${user.id}`);
            setDetails(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !user.societyId) {
            navigate("/society/join");
            return;
        }
        loadDetails();
    }, [user?.societyId, navigate]);

    const handleApprove = async (memberId) => {
        try {
            await api.put(`/societies/approve/${memberId}?adminId=${user.id}`);
            alert("Member Approved! ✅");
            loadDetails();
        } catch (err) {
            console.error(err);
            alert("Error approving member");
        }
    };

    if (loading) return <div className="text-center mt-5"><h3>Loading Dashboard...</h3></div>;

    if (!details) return (
        <>
            <Navbar />
            <div className="container mt-5 text-center">
                <h2>No Society Found</h2>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/society/join")}>Join or Create</button>
            </div>
        </>
    );

    const { society, myRole, members } = details;

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="row">
                    {/* Society Overview */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 p-4 bg-primary text-white mb-4">
                            <h6 className="text-uppercase small fw-bold opacity-75">My Society</h6>
                            <h2 className="fw-bold mb-3">{society.name}</h2>
                            <p className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>{society.address}, {society.city} - {society.pincode}</p>
                            <div className="mt-4 p-3 bg-white bg-opacity-10 rounded">
                                <span className="small d-block opacity-75">INVITE CODE</span>
                                <span className="h4 fw-bold letter-spacing-2">{society.inviteCode}</span>
                            </div>
                            <div className="mt-3">
                                <span className="badge bg-warning text-dark me-2">{myRole}</span>
                                <span className="small opacity-75">Member since {new Date(society.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0 p-4 mb-4">
                            <h5 className="fw-bold mb-3">Bulk Order Info</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Discount</span>
                                <span className="fw-bold text-success">{society.discountPercentage}%</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <span className="text-muted">Threshold</span>
                                <span className="fw-bold">{society.threshold} units</span>
                            </div>
                            <button
                                className="btn btn-outline-primary w-100 fw-bold"
                                onClick={() => navigate("/community")}
                            >
                                View Bulk Orders
                            </button>
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0 p-0 overflow-hidden">
                            <div className="px-4 py-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0">Society Members ({members.length})</h5>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-4 py-3">User ID</th>
                                            <th className="py-3">Role</th>
                                            <th className="py-3">Status</th>
                                            <th className="py-3 text-end px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map(m => (
                                            <tr key={m.id}>
                                                <td className="px-4 py-3 fw-bold text-muted">#{m.userId}</td>
                                                <td className="py-3">
                                                    <span className={`badge ${m.role === 'SOCIETY_ADMIN' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                                                        {m.role}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`badge ${m.status === 'APPROVED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {m.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-end px-4">
                                                    {myRole === 'SOCIETY_ADMIN' && m.status === 'PENDING' && (
                                                        <button
                                                            className="btn btn-sm btn-success fw-bold"
                                                            onClick={() => handleApprove(m.id)}
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {m.userId === user.id && <span className="text-muted small italic">You</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-5" />

                {/* Society Bulk Deals Section */}
                <div className="row mb-5">
                    <div className="col-12">
                        <SocietyBulkDeals societyId={society.id} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default SocietyDashboard;
