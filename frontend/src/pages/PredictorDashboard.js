import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function PredictorDashboard() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [predictions, setPredictions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.email) {
            loadPredictions();
        }
    }, [user]);

    const loadPredictions = async () => {
        try {
            const res = await api.get(`/predictions?email=${user.email}`);
            setPredictions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4 pb-5">
                <h2 className="fw-bold mb-4">Monthly Consumption Predictor</h2>
                <p className="text-muted mb-4 shadow-sm p-3 bg-white rounded border-start border-primary border-5">
                    🚀 Our AI analyzes your shopping patterns to predict when you'll run out of your favorite items.
                    Get ahead of your needs and reorder before it's too late!
                </p>

                {predictions.length === 0 ? (
                    <div className="text-center py-5 mt-4 bg-white rounded shadow-sm">
                        <h5 className="text-muted">No predictions available yet.</h5>
                        <p className="small text-muted">Predictions will appear after you've ordered the same products a few times.</p>
                    </div>
                ) : (
                    <div className="row">
                        {predictions.map(pred => (
                            <div key={pred.productId} className="col-md-4 mb-4">
                                <div className={`card h-100 shadow border-0 ${pred.daysRemaining < 3 ? 'border-start border-danger border-5' : 'border-start border-info border-5'}`}>
                                    <div className="row g-0">
                                        <div className="col-4 d-flex align-items-center justify-content-center bg-light">
                                            <img
                                                src={pred.imageUrl}
                                                alt={pred.productName}
                                                className="img-fluid p-2"
                                                style={{ maxHeight: '100px', objectFit: 'contain' }}
                                            />
                                        </div>
                                        <div className="col-8">
                                            <div className="card-body">
                                                <h6 className="fw-bold mb-1">{pred.productName}</h6>
                                                <p className={`small fw-bold mb-2 ${pred.daysRemaining < 3 ? 'text-danger' : 'text-primary'}`}>
                                                    {pred.daysRemaining <= 0 ? "⚠️ Run out already!" : `Reorder in ~${pred.daysRemaining} days`}
                                                </p>
                                                <p className="small text-muted mb-3">Predicted: {new Date(pred.predictedDate).toLocaleDateString()}</p>
                                                <button
                                                    className="btn btn-sm btn-outline-primary fw-bold w-100"
                                                    onClick={() => navigate(`/product/${pred.productId}`)}
                                                >
                                                    View & Reorder
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-5 p-4 bg-dark text-white rounded shadow">
                    <h5 className="fw-bold mb-3">How it works?</h5>
                    <ul className="small mb-0 opacity-75">
                        <li>Analyses frequency of your previous orders for each product.</li>
                        <li>Calculates average gap between purchases.</li>
                        <li>Predicts the next possible date you might need it again.</li>
                        <li>Shows "Urgent" flags when items are predicted to be finished within 3 days.</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default PredictorDashboard;
