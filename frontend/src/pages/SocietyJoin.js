import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function SocietyJoin() {
    const [societies, setSocieties] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [activeBulkOrders, setActiveBulkOrders] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        loadSocieties();
        if (user && user.societyId) {
            loadBulkOrders(user.societyId);
        }
    }, [user]);

    // Timer logic
    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const loadSocieties = async () => {
        try {
            const res = await api.get("/societies");
            setSocieties(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadBulkOrders = async (sid) => {
        try {
            const res = await api.get(`/bulk-orders/society/${sid}`);
            setActiveBulkOrders(res.data);
            
            // Initialize quantities for UI state
            const initialQuantities = {};
            res.data.forEach(bo => {
                initialQuantities[bo.id] = bo.userContribution > 0 ? bo.userContribution : 1;
            });
            setQuantities(initialQuantities);
        } catch (err) {
            console.error(err);
        }
    };

    const handleJoinSociety = async (inviteCode) => {
        try {
            const res = await api.post(`/societies/join?userId=${user.id}&inviteCode=${inviteCode}`);
            const updatedUser = res.data;
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert("Joined society successfully! 🎉");
        } catch (err) {
            console.error(err);
            alert("Error joining society");
        }
    };

    const handleJoinBulkDeal = async (bulkOrderId) => {
        try {
            const q = quantities[bulkOrderId] || 1;
            await api.post(`/bulk-orders/join`, {
                bulkOrderId: bulkOrderId,
                quantity: q
            });
            alert("Joined Bulk Deal successfully!");
            loadBulkOrders(user.societyId);
        } catch (err) {
            console.error(err);
            alert("Error joining bulk deal. You may be exceeding the target quantity.");
        }
    };

    const handleUpdateContribution = async (bulkOrderId, delta) => {
        const bo = activeBulkOrders.find(b => b.id === bulkOrderId);
        if (!bo) return;
        
        const currentContrib = bo.userContribution || 0;
        const newTotal = currentContrib + delta;
        
        if (newTotal <= 0) {
            if (window.confirm("Are you sure you want to leave this bulk deal?")) {
                handleLeaveBulkDeal(bulkOrderId);
            }
            return;
        }

        try {
            await api.put(`/bulk-orders/update`, {
                bulkOrderId: bulkOrderId,
                quantity: newTotal
            });
            loadBulkOrders(user.societyId);
        } catch (err) {
            console.error(err);
            alert("Error updating contribution.");
        }
    };

    const handleLeaveBulkDeal = async (bulkOrderId) => {
        try {
            await api.delete(`/bulk-orders/leave?bulkOrderId=${bulkOrderId}`);
            alert("Left the bulk deal.");
            loadBulkOrders(user.societyId);
        } catch (err) {
            console.error(err);
            alert("Error leaving bulk deal.");
        }
    };
    
    const handleQuantityChange = (bulkOrderId, amount) => {
        setQuantities(prev => ({
            ...prev,
            [bulkOrderId]: Math.max(1, (prev[bulkOrderId] || 1) + amount)
        }));
    };

    const formatTimeLeft = (expiryTime) => {
        const expiry = new Date(expiryTime).getTime();
        const diff = expiry - currentTime;
        
        if (diff <= 0) return "Expired";
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="fw-bold mb-4">Community Bulk Ordering</h2>

                {user && user.societyId ? (
                    <div className="card p-4 shadow-sm border-0 bg-light mb-5">
                        <h4 className="text-primary fw-bold">My Society</h4>
                        <p className="text-muted">You are a member of Society ID: {user.societyId}</p>

                        <hr />
                        <h5 className="mb-3">Active Community Bulk Orders</h5>
                        {activeBulkOrders.length === 0 ? (
                            <p className="text-muted">No active bulk orders for your society yet.</p>
                        ) : (
                            <div className="row">
                                {activeBulkOrders.map(bo => {
                                    const progress = Math.min(100, (bo.currentQuantity / bo.targetQuantity) * 100);
                                    const isCompleted = bo.status === "COMPLETED";
                                    const isExpired = new Date(bo.expiryTime).getTime() <= currentTime;
                                    const hasJoined = bo.userContribution > 0;
                                    
                                    return (
                                        <div key={bo.id} className="col-md-6 mb-4">
                                            <div className="card p-3 border-0 shadow h-100">
                                                <div className="d-flex mb-3">
                                                    <img 
                                                        src={bo.productImage} 
                                                        alt={bo.productName} 
                                                        style={{ width: "80px", height: "80px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f8f9fa", padding: "5px" }} 
                                                        className="me-3"
                                                    />
                                                    <div>
                                                        <h5 className="fw-bold mb-1">{bo.productName}</h5>
                                                        <div className="text-muted d-flex align-items-center">
                                                            <span className="text-decoration-line-through me-2">₹{bo.originalPrice}</span>
                                                            <span className="badge bg-success">{bo.discountPercentage}% OFF</span>
                                                        </div>
                                                        <div className="fw-bold mt-1 text-primary">
                                                            Discounted Price: ₹{(bo.originalPrice * (1 - bo.discountPercentage/100)).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {!isCompleted && !isExpired && (
                                                    <div className="text-danger small fw-bold mb-2">
                                                        <i className="bi bi-clock me-1"></i> Ends in: {formatTimeLeft(bo.expiryTime)}
                                                    </div>
                                                )}

                                                <div className="progress mb-2" style={{ height: '20px' }}>
                                                    <div
                                                        className={`progress-bar progress-bar-striped progress-bar-animated ${isCompleted ? 'bg-success' : 'bg-primary'}`}
                                                        role="progressbar"
                                                        style={{ width: `${progress}%` }}
                                                    >
                                                        {bo.currentQuantity} / {bo.targetQuantity}
                                                    </div>
                                                </div>
                                                <small className="text-muted mb-3 d-block text-center">
                                                    {isCompleted 
                                                        ? "Target reached! Discount applied." 
                                                        : `Need ${bo.targetQuantity - bo.currentQuantity} more units to unlock discount!`}
                                                </small>

                                                <div className="mt-auto">
                                                    {isCompleted ? (
                                                        <div className="alert alert-success text-center fw-bold py-2 mb-0">
                                                            🎉 Bulk Deal Completed
                                                            {hasJoined && <div className="small fw-normal">You contributed {bo.userContribution} units. Check your orders!</div>}
                                                        </div>
                                                    ) : isExpired ? (
                                                        <div className="alert alert-secondary text-center fw-bold py-2 mb-0">
                                                            ⏳ Bulk Deal Expired
                                                        </div>
                                                    ) : hasJoined ? (
                                                        <div className="bg-light p-3 rounded text-center border">
                                                            <div className="mb-2 text-primary fw-bold">
                                                                <i className="bi bi-check-circle-fill me-1"></i> You contributed: {bo.userContribution} units
                                                            </div>
                                                            <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                                                                <button className="btn btn-outline-secondary btn-sm rounded-circle px-2" onClick={() => handleUpdateContribution(bo.id, -1)}>-</button>
                                                                <span className="fw-bold mx-2">{bo.userContribution}</span>
                                                                <button className="btn btn-outline-secondary btn-sm rounded-circle px-2" onClick={() => handleUpdateContribution(bo.id, 1)} disabled={bo.currentQuantity >= bo.targetQuantity}>+</button>
                                                            </div>
                                                            <button className="btn btn-outline-danger btn-sm w-100 fw-bold" onClick={() => handleLeaveBulkDeal(bo.id)}>
                                                                Leave Bulk Deal
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex gap-2">
                                                            <div className="input-group" style={{ width: "120px" }}>
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(bo.id, -1)}>-</button>
                                                                <input type="text" className="form-control text-center" value={quantities[bo.id] || 1} readOnly />
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(bo.id, 1)}>+</button>
                                                            </div>
                                                            <button 
                                                                className="btn btn-primary flex-grow-1 fw-bold"
                                                                onClick={() => handleJoinBulkDeal(bo.id)}
                                                            >
                                                                Join Deal
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="row">
                        <h4 className="mb-3">Join a Society to unlock Bulk Discounts</h4>
                        {societies.map(s => (
                            <div key={s.id} className="col-md-4 mb-4">
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-dark">{s.name}</h5>
                                        <p className="card-text text-muted small">{s.location}</p>
                                        <p className="mb-1 text-success fw-bold">Discount: {s.discountPercentage}%</p>
                                        <p className="small text-muted">Threshold: {s.threshold} units</p>
                                        <button
                                            className="btn btn-primary w-100 fw-bold mt-2"
                                            onClick={() => handleJoinSociety(s.inviteCode)}
                                        >
                                            Join Society
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default SocietyJoin;
