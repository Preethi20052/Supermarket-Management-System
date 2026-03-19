import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../services/productService";
import { getOrders, cancelOrder as apiCancelOrder, getDashboardStats, updateOrderStatus } from "../services/orderService";
import { getNotifications, markAsRead as apiMarkAsRead } from "../services/notificationService";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0, totalRevenue: 0, totalProducts: 0, lowStockProducts: 0,
    fastMovingProducts: [], slowMovingProducts: [], urgentNotificationsCount: 0
  });
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [filterSales, setFilterSales] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSentiment, setShowSentiment] = useState(false);
  const [unhappyCustomers, setUnhappyCustomers] = useState([]);
  const [showBulkDeals, setShowBulkDeals] = useState(false);
  const [bulkDeals, setBulkDeals] = useState([]);
  const [bulkDealForm, setBulkDealForm] = useState({
    productId: "",
    societyId: "",
    targetQuantity: "",
    discountPercentage: "",
    startTime: "",
    endTime: ""
  });
  const [societies, setSocieties] = useState([]);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [selectedBulkDealId, setSelectedBulkDealId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    imageUrl: "",
    manufactureDate: "",
    expiryDate: "",
  });

  // 🔐 Protect Admin Route
  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/");
    }
  }, [role, navigate]);

  // 📦 Load Data
  useEffect(() => {
    loadProducts();
    loadOrders();
    loadStats();
    loadNotifications();
  }, []);

  useEffect(() => {
    if (showSentiment) {
      api.get("/feedback/unhappy-customers")
        .then(res => setUnhappyCustomers(res.data))
        .catch(err => console.error("Feedback error:", err));
    }
  }, [showSentiment]);

  const loadNotifications = () => {
    getNotifications().then(res => setNotifications(res.data)).catch(err => console.log(err));
  };

  const loadStats = () => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  };

  const loadProducts = () => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  };

  const loadOrders = () => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  };

  // 📝 Handle Form Change
  useEffect(() => {
    if (showBulkDeals) {
      loadBulkDeals();
      loadSocieties();
    }
  }, [showBulkDeals]);

  const loadSocieties = () => {
    api.get("/societies")
      .then(res => setSocieties(res.data))
      .catch(err => console.error("Societies error:", err));
  };

  const loadBulkDeals = () => {
    api.get("/bulk-orders/all")
      .then((res) => setBulkDeals(res.data))
      .catch((err) => console.log(err));
  };

  const handleBulkDealChange = (e) => {
    setBulkDealForm({ ...bulkDealForm, [e.target.name]: e.target.value });
  };

  const handleCreateBulkDeal = (e) => {
    e.preventDefault();
    if (!bulkDealForm.productId || !bulkDealForm.societyId) {
      alert("Product and Society are required");
      return;
    }
    const payload = {
       productId: Number(bulkDealForm.productId),
       societyId: Number(bulkDealForm.societyId),
       targetQuantity: Number(bulkDealForm.targetQuantity),
       discountPercentage: Number(bulkDealForm.discountPercentage),
       startTime: bulkDealForm.startTime || null,
       endTime: bulkDealForm.endTime || null
    };
    api.post("/bulk-orders/create", payload)
       .then(() => {
         alert("Bulk Deal Created!");
         setBulkDealForm({ productId: "", societyId: "", targetQuantity: "", discountPercentage: "", startTime: "", endTime: "" });
         loadBulkDeals();
       })
       .catch(err => alert("Error creating bulk deal"));
  };

  const handleEndDeal = (id) => {
    if (window.confirm("End this bulk deal? It will be marked as EXPIRED.")) {
      api.post(`/bulk-orders/end/${id}`)
        .then(() => {
          alert("Deal ended");
          loadBulkDeals();
        })
        .catch(err => alert("Error ending deal"));
    }
  };

  const handleDeleteDeal = (id) => {
    if (window.confirm("Delete this bulk deal? ALL participant data for this deal will be removed!")) {
      api.delete(`/bulk-orders/delete/${id}`)
        .then(() => {
          alert("Deal deleted");
          loadBulkDeals();
        })
        .catch(err => alert("Error deleting deal"));
    }
  };

  const handleViewParticipants = (id) => {
    setSelectedBulkDealId(id);
    api.get(`/bulk-orders/participants/${id}`)
      .then(res => {
        setCurrentParticipants(res.data);
        setShowParticipantsModal(true);
      })
      .catch(err => alert("Error loading participants"));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add or Update Product
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!form.name || !form.price) {
      alert("Name and Price are required!");
      return;
    }

    const preparedForm = {
      ...form,
      price: form.price === "" ? null : Number(form.price),
      stock: form.stock === "" ? 0 : Number(form.stock),
      manufactureDate: form.manufactureDate === "" ? null : form.manufactureDate,
      expiryDate: form.expiryDate === "" ? null : form.expiryDate
    };

    if (editingId) {
      updateProduct(editingId, preparedForm)
        .then(() => {
          alert("Product Updated!");
          resetForm();
          loadProducts();
        })
        .catch((err) => {
          console.error("Update Error:", err);
          alert("Error updating product: " + (err.response?.data?.message || err.message || "Unknown error"));
        });
    } else {
      addProduct(preparedForm)
        .then(() => {
          alert("Product Added!");
          resetForm();
          loadProducts();
        })
        .catch((err) => {
          console.error("Add Error:", err);
          alert("Error adding product: " + (err.response?.data?.message || err.message || "Unknown error"));
        });
    }
  };

  // ✏ Edit Product
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price !== null && product.price !== undefined ? String(product.price) : "",
      stock: product.stock !== null && product.stock !== undefined ? String(product.stock) : "",
      imageUrl: product.imageUrl || "",
      manufactureDate: product.manufactureDate || "",
      expiryDate: product.expiryDate || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ❌ Delete Product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteProduct(id).then(() => {
        alert("Product Deleted!");
        loadProducts();
      });
    }
  };

  // 🚫 Cancel Order (Admin)
  const handleCancelOrder = (id) => {
    if (window.confirm("Cancel this order?")) {
      apiCancelOrder(id)
        .then(() => {
          alert("Order Cancelled");
          loadOrders();
          loadStats();
        })
        .catch(() => alert("Error cancelling order"));
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    updateOrderStatus(id, newStatus)
      .then(() => {
        alert("Status Updated!");
        loadOrders();
        loadNotifications();
      })
      .catch((err) => alert("Error updating status"));
  };

  const handleMarkNotificationAsRead = (id) => {
    apiMarkAsRead(id).then(() => {
      loadNotifications();
      loadStats();
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
      imageUrl: "",
      manufactureDate: "",
      expiryDate: "",
    });
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderProductCard = (p) => {
    const isHighDemand = stats.fastMovingProducts?.some(fp => fp.id === p.id);
    const isExpiring = p.expiryDate && new Date(p.expiryDate) < new Date(new Date().getTime() + (10 * 24 * 60 * 60 * 1000));

    return (
      <div className="col-md-3 mb-4" key={p.id}>
        <div className={`card shadow-sm h-100 border-0 ${isExpiring ? 'border-start border-danger border-5' : ''}`}>
          <div style={{ position: 'relative' }}>
            {isHighDemand && <span className="badge bg-danger p-2" style={{ position: 'absolute', top: 10, left: 10, fontSize: '0.75rem' }}>🔥 HIGH DEMAND</span>}
            {isExpiring && <span className="badge bg-warning text-dark p-2" style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.75rem' }}>⌛ EXPIRING</span>}
            <img
              src={p.imageUrl}
              alt=""
              className="card-img-top"
              style={{ height: "180px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
            />
          </div>
          <div className="card-body">
            <h6 className="fw-bold">{p.name}</h6>
            <p className="text-muted small mb-1">{p.category}</p>
            <p className="text-success fw-bold mb-2">₹ {p.price}</p>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small">Stock: <span className={p.stock < 10 ? 'text-danger fw-bold' : ''}>{p.stock}</span></span>
              <span className="small text-muted">{p.expiryDate ? `Exp: ${p.expiryDate}` : ''}</span>
            </div>

            <div className="d-grid gap-2 d-md-flex">
              <button
                className="btn btn-outline-warning btn-sm flex-grow-1"
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-danger btn-sm flex-grow-1"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">
        <span className="navbar-brand fw-bold fs-4">SuperMart Admin</span>
        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${!showOrders && !showSentiment && !showBulkDeals ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => { setShowOrders(false); setShowSentiment(false); setShowBulkDeals(false); }}
          >
            Manage Products
          </button>
          <button
            className={`btn btn-sm ${showOrders ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => { setShowOrders(true); setShowSentiment(false); setShowBulkDeals(false); }}
          >
            Manage Orders
          </button>
          <button
            className={`btn btn-sm ${showBulkDeals ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => { setShowBulkDeals(true); setShowOrders(false); setShowSentiment(false); }}
          >
            Manage Bulk Deals
          </button>
          <button
            className={`btn btn-sm ${showSentiment ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => { setShowSentiment(true); setShowOrders(false); setShowBulkDeals(false); }}
          >
            Customer Sentiment
          </button>
          <button className="btn btn-sm btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container mt-4 pb-5">
        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-0 bg-primary text-white p-3">
              <h6 className="text-uppercase small fw-bold">📦 Total Orders</h6>
              <h3>{stats.totalOrders}</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className={`card text-center shadow-sm border-0 bg-success text-white p-3 cursor-pointer ${filterSales ? 'ring ring-white' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setShowOrders(true);
                setFilterSales(!filterSales);
                setFilterLowStock(false);
                setShowSentiment(false);
                setShowBulkDeals(false);
              }}
            >
              <h6 className="text-uppercase small fw-bold">💰 Revenue {filterSales ? '(Active Sales)' : ''}</h6>
              <h3>₹ {stats.totalRevenue.toLocaleString()}</h3>
              {filterSales && <small className="fw-bold">Click to show all orders</small>}
            </div>
          </div>
          <div className="col-md-3">
            <div
              className={`card text-center shadow-sm border-0 bg-info text-white p-3 cursor-pointer ${groupByCategory ? 'ring ring-white' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setShowOrders(false);
                setGroupByCategory(!groupByCategory);
                setFilterLowStock(false);
                setFilterSales(false);
                setShowSentiment(false);
                setShowBulkDeals(false);
              }}
            >
              <h6 className="text-uppercase small fw-bold">🏪 Total Products {groupByCategory ? '(By Category)' : ''}</h6>
              <h3>{stats.totalProducts}</h3>
              {groupByCategory && <small className="fw-bold">Click to show all</small>}
            </div>
          </div>
          <div className="col-md-3">
            <div
              className={`card text-center shadow-sm border-0 bg-danger text-white p-3 ${stats.lowStockProducts > 0 ? 'cursor-pointer' : ''}`}
              style={{ cursor: stats.lowStockProducts > 0 ? 'pointer' : 'default' }}
              onClick={() => stats.lowStockProducts > 0 && setFilterLowStock(!filterLowStock)}
            >
              <h6 className="text-uppercase small fw-bold">⚠️ Low Stock {filterLowStock ? '(Active Filter)' : ''}</h6>
              <h3>{stats.lowStockProducts}</h3>
              {filterLowStock && <small className="fw-bold">Click to show all</small>}
            </div>
          </div>
        </div>

        {/* 🔔 Notification Center Overlay */}
        {showNotifications && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow border-0 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h5 className="m-0 fw-bold">Recent Alerts</h5>
                  <button className="btn-close" onClick={() => setShowNotifications(false)}></button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-center text-muted py-3">No unread notifications</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {notifications.map(n => (
                      <li key={n.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <span className={`badge me-2 bg-${n.type === 'ORDER' ? 'primary' : n.type === 'STOCK' ? 'danger' : 'warning'}`}>
                            {n.type}
                          </span>
                          {n.message}
                          <div className="text-muted small">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        <button className="btn btn-sm btn-link text-decoration-none" onClick={() => handleMarkNotificationAsRead(n.id)}>
                          Mark as read
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {showSentiment ? (
          <div className="card shadow border-0 p-4">
            <h4 className="fw-bold text-danger mb-4">📢 Customer Mood & Sentiment Report</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="fw-bold text-muted">🚩 Unhappy Customers (Flagged for follow-up)</h6>
                  <p className="small text-muted">Customers who have given 3 or more negative reviews.</p>
                  {unhappyCustomers.length === 0 ? (
                    <p className="text-success fw-bold">No unhappy customers flagged! 🎉</p>
                  ) : (
                    <table className="table bg-white table-bordered mt-3">
                      <thead className="table-dark">
                        <tr>
                          <th>User ID</th>
                          <th>Customer Name</th>
                          <th>Negative Feedback Count</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unhappyCustomers.map(cust => (
                          <tr key={cust.userId}>
                            <td>#{cust.userId}</td>
                            <td className="fw-bold">{cust.userName}</td>
                            <td><span className="badge bg-danger">{cust.negativeCount}</span></td>
                            <td>
                              <button className="btn btn-sm btn-primary">Contact Customer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : showBulkDeals ? (
          <>
          <div className="card p-4 mb-4 shadow-sm border-0">
            <h4 className="mb-4 text-secondary fw-bold">Create Bulk Deal</h4>
            <form onSubmit={handleCreateBulkDeal}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Select Product</label>
                  <select name="productId" className="form-select" value={bulkDealForm.productId} onChange={handleBulkDealChange} required>
                    <option value="">-- Select Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Select Society</label>
                  <select name="societyId" className="form-select" value={bulkDealForm.societyId} onChange={handleBulkDealChange} required>
                    <option value="">-- Select Society --</option>
                    {societies.map(s => (
                      <option key={s.id} value={s.id}>{s.name || `Society ${s.id}`}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-bold">Target Qty</label>
                  <input type="number" name="targetQuantity" placeholder="Target Qty" className="form-control" value={bulkDealForm.targetQuantity} onChange={handleBulkDealChange} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-bold">Discount %</label>
                  <input type="number" name="discountPercentage" placeholder="Discount %" className="form-control" value={bulkDealForm.discountPercentage} onChange={handleBulkDealChange} required />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Start Time</label>
                  <input type="datetime-local" name="startTime" className="form-control" value={bulkDealForm.startTime} onChange={handleBulkDealChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">End Time</label>
                  <input type="datetime-local" name="endTime" className="form-control" value={bulkDealForm.endTime} onChange={handleBulkDealChange} required />
                </div>

                <div className="col-md-6 d-flex align-items-end">
                  {bulkDealForm.productId && bulkDealForm.discountPercentage && (
                    <div className="alert alert-info py-2 px-3 mb-0 w-100">
                      <strong>Calculated Deal Price:</strong> ₹ 
                      {(products.find(p => String(p.id) === String(bulkDealForm.productId))?.price * (1 - bulkDealForm.discountPercentage / 100)).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-4 fw-bold">Create Bulk Deal</button>
            </form>
          </div>
            
            <h4 className="text-secondary fw-bold mb-3">Active Bulk Deals</h4>
            <div className="table-responsive bg-white rounded shadow-sm p-3">
              <table className="table table-hover align-middle">
                 <thead className="table-light">
                   <tr>
                     <th>Product</th>
                     <th>Society</th>
                     <th>Participants</th>
                     <th>Progress</th>
                     <th>Status</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                    {bulkDeals.map(d => {
                       const progress = Math.min(100, (d.currentQuantity / d.targetQuantity) * 100);
                       const societyName = societies.find(s => String(s.id) === String(d.societyId))?.name || `Society ${d.societyId}`;
                       
                       return (
                        <tr key={d.id}>
                           <td>
                             <div className="d-flex align-items-center gap-2">
                               {d.productImage && <img src={d.productImage} alt="" style={{width: 30, height: 30, objectFit: 'contain'}} />}
                               <div>
                                 <div className="fw-bold small">{d.productName || 'Unknown'}</div>
                                 <div className="text-muted" style={{fontSize: '0.7rem'}}>ID: {d.productId}</div>
                               </div>
                             </div>
                           </td>
                           <td>{societyName}</td>
                           <td className="text-center">
                             <span className="badge bg-light text-dark border">{d.participantsCount || 0}</span>
                           </td>
                           <td style={{minWidth: 150}}>
                             <div className="small text-muted mb-1">{d.currentQuantity} / {d.targetQuantity} units</div>
                             <div className="progress" style={{height: 8}}>
                               <div 
                                 className={`progress-bar progress-bar-striped progress-bar-animated bg-${progress >= 100 ? 'success' : 'primary'}`} 
                                 role="progressbar" 
                                 style={{width: `${progress}%`}}
                               ></div>
                             </div>
                           </td>
                           <td>
                              <span className={`badge bg-${
                                d.status === 'COMPLETED' ? 'success' : 
                                d.status === 'EXPIRED' ? 'secondary' : 
                                d.status === 'UPCOMING' ? 'warning text-dark' : 'primary'
                              }`}>
                                 {d.status}
                              </span>
                           </td>
                           <td>
                             <div className="d-flex gap-1">
                               <button className="btn btn-sm btn-outline-info" onClick={() => handleViewParticipants(d.id)} title="View Participants">👥</button>
                               {d.status === 'ACTIVE' && (
                                 <button className="btn btn-sm btn-outline-warning" onClick={() => handleEndDeal(d.id)} title="End Deal Early">🛑</button>
                               )}
                               <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteDeal(d.id)} title="Delete Deal">🗑️</button>
                             </div>
                           </td>
                        </tr>
                       );
                    })}
                 </tbody>
              </table>
            </div>

            {/* Participants Modal */}
            {showParticipantsModal && (
              <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title fw-bold">Deal Participants (#{selectedBulkDealId})</h5>
                      <button type="button" className="btn-close" onClick={() => setShowParticipantsModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      {currentParticipants.length === 0 ? (
                        <p className="text-center py-4 text-muted">No participants have joined this deal yet.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-sm table-striped">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Flat Number</th>
                                <th>Quantity</th>
                                <th>Joined At</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentParticipants.map((p, idx) => (
                                <tr key={idx}>
                                  <td>{p.userName}</td>
                                  <td>{p.flatNumber || 'N/A'}</td>
                                  <td>{p.quantityJoined}</td>
                                  <td>{new Date(p.timeJoined).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowParticipantsModal(false)}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : !showOrders ? (
          <>
            {/* Add / Update Form */}
            <div className="card p-4 mb-4 shadow-sm border-0">
              <h4 className="mb-4 text-secondary fw-bold">
                {editingId ? "Update Product" : "Add New Product"}
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      name="name"
                      placeholder="Product Name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      name="category"
                      placeholder="Category"
                      className="form-control"
                      value={form.category}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      name="price"
                      type="number"
                      placeholder="Price (₹)"
                      className="form-control"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      name="stock"
                      type="number"
                      placeholder="Stock Quantity"
                      className="form-control"
                      value={form.stock}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      name="imageUrl"
                      placeholder="Image URL"
                      className="form-control"
                      value={form.imageUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mt-3">
                    <label className="form-label small text-muted">Manufacture Date</label>
                    <input
                      name="manufactureDate"
                      type="date"
                      className="form-control"
                      value={form.manufactureDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mt-3">
                    <label className="form-label small text-muted">Expiry Date</label>
                    <input
                      name="expiryDate"
                      type="date"
                      className="form-control"
                      value={form.expiryDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-success px-4 fw-bold"
                  >
                    {editingId ? "Update Product" : "Save Product"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary px-4"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-secondary fw-bold m-0">
                {filterLowStock ? "Low Stock Inventory" : groupByCategory ? "Inventory by Category" : "Inventory Management"}
              </h4>
              {(filterLowStock || groupByCategory) && (
                <button className="btn btn-sm btn-outline-secondary" onClick={() => { setFilterLowStock(false); setGroupByCategory(false); }}>
                  Show All Products
                </button>
              )}
            </div>

            {groupByCategory ? (
              Object.entries(products.reduce((acc, p) => {
                const cat = p.category || "Uncategorized";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(p);
                return acc;
              }, {})).map(([category, catProducts]) => (
                <div key={category} className="mb-5">
                  <h5 className="text-primary fw-bold border-bottom pb-2 mb-4">{category} ({catProducts.length})</h5>
                  <div className="row">
                    {catProducts.map(p => renderProductCard(p))}
                  </div>
                </div>
              ))
            ) : (
              <div className="row">
                {products
                  .filter(p => !filterLowStock || p.stock < 5)
                  .map((p) => renderProductCard(p))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Orders Management */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-secondary fw-bold m-0">
                {filterSales ? "Completed Sales (Revenue)" : "Customer Orders"}
              </h4>
              {filterSales && (
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setFilterSales(false)}>
                  Show All Orders
                </button>
              )}
            </div>
            <div className="table-responsive bg-white rounded shadow-sm p-3">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Customer Email</th>
                    <th>Qty</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-4">No orders found</td></tr>
                  ) : (
                    orders
                      .filter(order => !filterSales || order.status !== "CANCELLED")
                      .map(order => (
                        <tr key={order.id}>
                          <td className="fw-bold">#{order.id}</td>
                          <td>{order.productName}</td>
                          <td>{order.email || order.userId || "N/A"}</td>
                          <td>{order.quantity}</td>
                          <td className="fw-bold">₹ {order.totalPrice}</td>
                          <td>
                            <span className={`badge bg-${order.status === 'CANCELLED' ? 'danger' : order.status === 'DELIVERED' ? 'success' : 'warning'} bg-opacity-10 text-${order.status === 'CANCELLED' ? 'danger' : order.status === 'DELIVERED' ? 'success' : 'warning'} border`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            {order.status !== "CANCELLED" && order.status !== "DELIVERED" ? (
                              <div className="d-flex gap-2">
                                <select
                                  className="form-select form-select-sm"
                                  value={order.status}
                                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                </select>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted small">{order.status}</span>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

