import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { placeOrder } from "../services/orderService";

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { payload, total } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [processing, setProcessing] = useState(false);

    if (!payload) {
        return <div className="container mt-5 text-center"><h3>Invalid Access</h3><button className="btn btn-primary" onClick={() => navigate("/cart")}>Return to Cart</button></div>;
    }

    const handlePayment = () => {
        setProcessing(true);
        // Simulate a delay
        setTimeout(() => {
            placeOrder(payload)
                .then(() => {
                    alert("Payment Successful! Order Confirmed ✅");
                    navigate("/orders");
                })
                .catch(err => {
                    alert("Error: " + (err.response?.data || err.message));
                    setProcessing(false);
                });
        }, 2000);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow border-0 p-4">
                        <h2 className="text-center mb-4">Payment Simulation</h2>
                        <div className="bg-light p-3 rounded mb-4">
                            <div className="d-flex justify-content-between">
                                <span>Total Payable:</span>
                                <span className="fw-bold fs-4 text-success">₹ {total}</span>
                            </div>
                        </div>

                        <h5 className="mb-3">Select Payment Method</h5>
                        <div className="d-grid gap-3 mb-4">
                            <button
                                className={`btn btn-outline-primary p-3 d-flex justify-content-between align-items-center ${paymentMethod === 'UPI' ? 'active shadow-sm' : ''}`}
                                onClick={() => setPaymentMethod('UPI')}
                            >
                                <span>📲 UPI</span>
                                {paymentMethod === 'UPI' && <span>✅</span>}
                            </button>
                            <button
                                className={`btn btn-outline-primary p-3 d-flex justify-content-between align-items-center ${paymentMethod === 'CARD' ? 'active shadow-sm' : ''}`}
                                onClick={() => setPaymentMethod('CARD')}
                            >
                                <span>💳 Credit / Debit Card</span>
                                {paymentMethod === 'CARD' && <span>✅</span>}
                            </button>
                            <button
                                className={`btn btn-outline-primary p-3 d-flex justify-content-between align-items-center ${paymentMethod === 'COD' ? 'active shadow-sm' : ''}`}
                                onClick={() => setPaymentMethod('COD')}
                            >
                                <span>💵 Cash On Delivery</span>
                                {paymentMethod === 'COD' && <span>✅</span>}
                            </button>
                        </div>

                        <button
                            className="btn btn-success btn-lg w-100 fw-bold"
                            onClick={handlePayment}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </>
                            ) : (
                                `Pay ₹ ${total} Now`
                            )}
                        </button>

                        <button
                            className="btn btn-link text-muted mt-3"
                            onClick={() => navigate("/cart")}
                            disabled={processing}
                        >
                            Cancel and Return to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;
