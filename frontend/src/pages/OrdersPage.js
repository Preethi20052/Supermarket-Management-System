import React, { useEffect, useState } from "react";
import { getOrders, cancelOrder as apiCancelOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

function OrderPage() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const loadOrders = () => {
    getOrders()
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  };

  const handleCancelOrder = (id) => {
    apiCancelOrder(id)
      .then(() => {
        alert("Order Cancelled");
        loadOrders();
      })
      .catch(() => alert("Cannot cancel delivered order"));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
      case "PLACED": return "text-warning";
      case "SHIPPED": return "text-primary";
      case "OUT_FOR_DELIVERY": return "text-info";
      case "DELIVERED": return "text-success";
      case "CANCELLED": return "text-danger";
      default: return "";
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <h5>No Orders Yet</h5>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card mb-3 shadow">
            <div className="card-header d-flex justify-content-between align-items-center bg-light">
              <span className="fw-bold">Order #{order.id}</span>
              <span className={`badge ${getStatusColor(order.status)} bg-opacity-10 border`}>
                {order.status}
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <h4 className="card-title text-primary fw-bold mb-3">{order.productName}</h4>
                  <p className="mb-2"><strong>Status:</strong> <span className={getStatusColor(order.status)}>{order.status}</span></p>
                  <p className="mb-2"><strong>Unit Price:</strong> ₹ {order.unitPrice || (order.totalPrice / order.quantity).toFixed(2)}</p>
                  <p className="mb-2"><strong>Quantity:</strong> {order.quantity}</p>
                  <p className="mb-2"><strong>Total Price:</strong> <span className="text-success fs-5 fw-bold">₹ {order.totalPrice}</span></p>
                  <p className="mb-1 text-muted"><small>Ordered on: {new Date(order.orderDate).toLocaleDateString()}</small></p>
                </div>
              </div>

              {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                <div className="mt-3 text-end border-top pt-2">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderPage;
