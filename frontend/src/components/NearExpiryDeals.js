import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const NearExpiryDeals = () => {
    const [deals, setDeals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/flash-sales")
            .then(res => setDeals(res.data))
            .catch(err => console.error("Error fetching flash sales", err));
    }, []);

    const calculateTimeLeft = (endTime) => {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const Timer = ({ endTime }) => {
        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

        useEffect(() => {
            const timer = setTimeout(() => {
                setTimeLeft(calculateTimeLeft(endTime));
            }, 1000);
            return () => clearTimeout(timer);
        });

        return (
            <span className="badge bg-danger">
                Ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
        );
    };

    if (deals.length === 0) return null;

    return (
        <div className="my-5 p-4 rounded" style={{ backgroundColor: "#fff5f5", border: "2px dashed #ff8787" }}>
            <h3 className="text-danger mb-4">🔥 Near Expiry Flash Sales</h3>
            <div className="row">
                {deals.map(deal => (
                    <div className="col-md-3 mb-4" key={deal.id}>
                        <div className="card h-100 shadow-sm border-danger">
                            <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge bg-warning text-dark">-{deal.discountPercentage}% OFF</span>
                            </div>
                            <img
                                src={deal.product.imageUrl}
                                className="card-img-top"
                                alt={deal.product.name}
                                style={{ height: "150px", objectFit: "contain", padding: "10px" }}
                            />
                            <div className="card-body">
                                <h6 className="card-title">{deal.product.name}</h6>
                                <p className="mb-1">
                                    <span className="text-decoration-line-through text-mutedSmall me-2">₹{deal.product.price}</span>
                                    <span className="text-danger fw-bold">₹{(deal.product.price * (1 - deal.discountPercentage / 100)).toFixed(2)}</span>
                                </p>
                                <div className="mb-3">
                                    <Timer endTime={deal.endTime} />
                                </div>
                                <button
                                    className="btn btn-outline-danger btn-sm w-100"
                                    onClick={() => navigate(`/product/${deal.product.id}`)}
                                >
                                    Grab it Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NearExpiryDeals;
