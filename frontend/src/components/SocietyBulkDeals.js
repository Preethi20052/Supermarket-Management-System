import React, { useState, useEffect } from "react";
import { getSocietyBulkDeals, joinBulkDeal } from "../services/bulkOrderService";

const SocietyBulkDeals = ({ societyId }) => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date().getTime());

    const loadDeals = React.useCallback(async () => {
        try {
            const res = await getSocietyBulkDeals(societyId);
            setDeals(res.data);
        } catch (err) {
            console.error("Error loading bulk deals:", err);
        } finally {
            setLoading(false);
        }
    }, [societyId]);

    useEffect(() => {
        loadDeals();
        const timer = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 1000);
        return () => clearInterval(timer);
    }, [loadDeals]);

    const handleJoin = async (dealId) => {
        const quantity = prompt("Enter quantity to join:", 1);
        if (!quantity || isNaN(quantity) || quantity <= 0) return;

        try {
            await joinBulkDeal(dealId, parseInt(quantity));
            alert("Successfully joined the bulk deal! 🎉");
            loadDeals();
        } catch (err) {
            console.error("Error joining deal:", err);
            alert(err.response?.data?.message || "Error joining bulk deal");
        }
    };

    const formatTimeLeft = (endTime) => {
        if (!endTime) return "N/A";
        const diff = new Date(endTime).getTime() - currentTime;
        if (diff <= 0) return "0h 0m 0s";

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        return `${h}h ${m}m ${s}s`;
    };

    if (loading) return <div className="text-center p-4">Loading deals...</div>;

    if (deals.length === 0) return (
        <div className="card shadow-sm border-0 p-4 text-center">
            <h5 className="text-muted">No bulk deals available for your society currently.</h5>
        </div>
    );

    return (
        <div className="row">
            <h4 className="fw-bold mb-4 px-3">Society Bulk Deals</h4>
            {deals.map(deal => {
                const progress = Math.min(100, (deal.currentQuantity / deal.targetQuantity) * 100);
                const isUpcoming = deal.status === "UPCOMING";
                const isActive = deal.status === "ACTIVE";
                const isCompleted = deal.status === "COMPLETED";
                const isExpired = deal.status === "EXPIRED";
                const hasJoined = deal.userContribution > 0;
                const discountedPrice = (deal.originalPrice * (1 - deal.discountPercentage / 100)).toFixed(2);

                return (
                    <div className="col-md-6 col-lg-4 mb-4" key={deal.id}>
                        <div className="card h-100 shadow-sm border-0 overflow-hidden position-relative">
                            {/* Badges */}
                            <div className="position-absolute top-0 end-0 p-2 d-flex flex-column gap-1 align-items-end" style={{ zIndex: 1 }}>
                                <span className="badge bg-danger shadow-sm">{deal.discountPercentage}% OFF</span>
                                {isUpcoming && <span className="badge bg-info text-dark">Starting Soon</span>}
                                {isCompleted && <span className="badge bg-success">Deal Completed</span>}
                                {isExpired && <span className="badge bg-secondary">Deal Expired</span>}
                            </div>

                            <img
                                src={deal.productImage || "https://via.placeholder.com/200"}
                                className="card-img-top"
                                alt={deal.productName}
                                style={{ height: "180px", objectFit: "contain", backgroundColor: "#f8f9fa", padding: "15px" }}
                            />

                            <div className="card-body d-flex flex-column p-4">
                                <h5 className="fw-bold mb-1">{deal.productName}</h5>
                                <div className="d-flex align-items-center mb-3">
                                    <span className="text-muted text-decoration-line-through me-2">₹{deal.originalPrice}</span>
                                    <span className="h4 mb-0 text-primary fw-bold">₹{discountedPrice}</span>
                                </div>

                                <div className="mb-2 d-flex justify-content-between small fw-bold">
                                    <span>Progress</span>
                                    <span>{deal.currentQuantity} / {deal.targetQuantity} units</span>
                                </div>
                                <div className="progress mb-3" style={{ height: "12px", borderRadius: "6px" }}>
                                    <div
                                        className={`progress-bar progress-bar-striped ${isActive ? 'progress-bar-animated' : ''} ${isCompleted ? 'bg-success' : 'bg-primary'}`}
                                        role="progressbar"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>

                                {isActive && (
                                    <div className="text-danger small fw-bold mb-3 d-flex align-items-center">
                                        <i className="bi bi-clock-fill me-2"></i>
                                        Time Left: {formatTimeLeft(deal.endTime)}
                                    </div>
                                )}

                                <div className="mt-auto">
                                    {isActive ? (
                                        <button
                                            className={`btn w-100 fw-bold py-2 ${hasJoined ? 'btn-outline-success disabled' : 'btn-primary'}`}
                                            onClick={() => handleJoin(deal.id)}
                                            disabled={hasJoined}
                                        >
                                            {hasJoined ? "JOINED" : "JOIN BULK DEAL"}
                                        </button>
                                    ) : isUpcoming ? (
                                        <button className="btn btn-secondary w-100 fw-bold py-2 disabled">STARTING SOON</button>
                                    ) : isCompleted ? (
                                        <div className="alert alert-success text-center py-2 mb-0 fw-bold">Deal Completed! 🎉</div>
                                    ) : (
                                        <div className="alert alert-secondary text-center py-2 mb-0 fw-bold">Deal Expired</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SocietyBulkDeals;
