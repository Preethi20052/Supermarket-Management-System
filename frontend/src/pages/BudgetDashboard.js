import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function BudgetDashboard() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [stats, setStats] = useState({ budget: 0, spending: 0, remaining: 0 });
    const [newBudget, setNewBudget] = useState("");

    useEffect(() => {
        if (user && user.email) {
            loadStats();
        }
    }, [user]);

    const loadStats = async () => {
        try {
            const res = await api.get(`/budget/stats?email=${user.email}`);
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetBudget = async () => {
        try {
            const res = await api.post(`/budget/set?email=${user.email}&budget=${newBudget}`);
            const updatedUser = res.data;
            // Update local user if response contains updated budget info
            const localUser = JSON.parse(localStorage.getItem("user"));
            const newLocalUser = { ...localUser, ...updatedUser };
            localStorage.setItem("user", JSON.stringify(newLocalUser));
            setUser(newLocalUser);
            loadStats();
            setNewBudget("");
            alert("Monthly budget set successfully! 💰");
        } catch (err) {
            console.error(err);
            alert("Error setting budget");
        }
    };

    const spendingPercentage = stats.budget > 0 ? (stats.spending / stats.budget) * 100 : 0;
    const isOverBudget = stats.spending > stats.budget && stats.budget > 0;

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="fw-bold mb-4">Monthly Budget Guard</h2>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card p-4 shadow-sm border-0 bg-white mb-4">
                            <h5 className="fw-bold text-secondary mb-3">Set Monthly Budget</h5>
                            <div className="d-flex gap-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter budget (₹)"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                />
                                <button className="btn btn-primary fw-bold" onClick={handleSetBudget}>Set</button>
                            </div>
                            <small className="text-muted mt-2">Setting a budget helps us warn you when you're spending too much.</small>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className={`card p-4 shadow-sm border-0 ${isOverBudget ? 'bg-danger text-white' : 'bg-success text-white'} mb-4`}>
                            <h5 className="fw-bold mb-3">Budget Status</h5>
                            <h3 className="fw-bold">₹ {stats.spending} / ₹ {stats.budget}</h3>
                            <p className="mb-0">{isOverBudget ? "⚠️ You are over budget!" : "✅ You are within budget."}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4 shadow-sm border-0 bg-light">
                    <h5 className="fw-bold text-dark mb-3">Spending Breakdown</h5>
                    <div className="progress" style={{ height: '30px' }}>
                        <div
                            className={`progress-bar ${isOverBudget ? 'bg-danger' : 'bg-primary'} progress-bar-striped progress-bar-animated`}
                            role="progressbar"
                            style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                        >
                            {Math.round(spendingPercentage)}%
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                        <span>Spent: ₹ {stats.spending}</span>
                        <span>Limit: ₹ {stats.budget}</span>
                    </div>
                    {isOverBudget && (
                        <div className="alert alert-warning mt-4 mb-0">
                            <strong>Tip:</strong> Look for products with "Budget Alternative" tags in the store to save money!
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default BudgetDashboard;
