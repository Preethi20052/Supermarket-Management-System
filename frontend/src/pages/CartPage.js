import React, { useEffect, useState } from "react";
import { getCartItems } from "../services/cartService";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            loadCart();
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const loadCart = () => {
        getCartItems()
            .then(res => {
                console.log("Cart Response:", res.data);
                setCartItems(res.data);
            })
            .catch(err => console.error("Failed to load cart", err));
    };

    const toggleSelection = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handlePlaceOrder = () => {
        if (selectedItems.length === 0) {
            alert("Please select items to order");
            return;
        }

        if (!user || !user.email) {
            alert("Please login to place order");
            navigate("/login");
            return;
        }

        // Prepare payload
        const payload = {
            cartItemIds: selectedItems,
            email: user.email
        };

        // Redirect to Payment Simulation instead of placing order directly
        navigate("/payment", { state: { payload, total } });
    };

    const total = cartItems
        .filter(item => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="container mt-4">
            <h2>Your Cart</h2>

            {cartItems.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={item.id} className="card p-3 mb-3 d-flex flex-row align-items-center justify-content-between shadow-sm">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-3"
                                    style={{ transform: "scale(1.5)" }}
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => toggleSelection(item.id)}
                                />
                                <div>
                                    <h5 className="mb-0">{item.productName}</h5>
                                    <small className="text-muted">Price: ₹ {item.price}</small>
                                </div>
                            </div>
                            <div className="text-end">
                                <span className="badge bg-primary rounded-pill">Qty: {item.quantity}</span>
                                <p className="mt-1 mb-0 fw-bold">₹ {item.price * item.quantity}</p>
                            </div>
                        </div>
                    ))}

                    <div className="d-flex justify-content-between align-items-center mt-4 border-top pt-3">
                        <h4>Selected Total: ₹ {total}</h4>

                        <button
                            className="btn btn-success btn-lg"
                            onClick={handlePlaceOrder}
                            disabled={selectedItems.length === 0}
                        >
                            Place Order ({selectedItems.length})
                        </button>
                    </div>
                </>
            )}

            <button
                className="btn btn-secondary w-100 mt-4"
                onClick={() => navigate("/customer")}
            >
                Back to Shopping
            </button>
        </div>
    );
}

export default CartPage;
