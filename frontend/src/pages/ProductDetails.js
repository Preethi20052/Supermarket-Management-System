import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: "" });
  const user = JSON.parse(localStorage.getItem("user"));

  const [alternatives, setAlternatives] = useState([]);

  useEffect(() => {
    loadProduct();
    loadFeedback();
    loadAlternatives();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await getProducts();
      const p = res.data.find(item => item.id.toString() === id);
      setProduct(p);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAlternatives = async () => {
    try {
      const res = await api.get(`/budget/alternatives/${id}`);
      setAlternatives(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFeedback = async () => {
    try {
      const res = await api.get(`/feedback/product/${id}`);
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to cart!");
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id, 1);
      alert("Added to cart! 🛒");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to give feedback");
      return;
    }
    try {
      await api.post("/feedback", {
        productId: id,
        userId: user.id,
        rating: newFeedback.rating,
        comment: newFeedback.comment
      });
      setNewFeedback({ rating: 5, comment: "" });
      loadFeedback();
      alert("Feedback submitted! ✅");
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <img src={product.imageUrl} alt={product.name} className="img-fluid rounded shadow" style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }} />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold">{product.name}</h2>
            <p className="badge bg-secondary">{product.category}</p>
            <h3 className="text-success fw-bold">₹ {product.price}</h3>
            <p className="text-muted">{product.description || "No description available."}</p>
            <p><strong>Stock:</strong> {product.stock}</p>

            {/* Cheaper Alternatives Section */}
            {alternatives.length > 0 && (
              <div className="mt-4 p-3 bg-light rounded border-start border-success border-5">
                <h6 className="fw-bold text-success mb-3">🌿 Switch to Save! (Cheaper Alternatives)</h6>
                <div className="d-flex flex-wrap gap-2">
                  {alternatives.map(alt => (
                    <div key={alt.id} className="card p-2 border-0 shadow-sm" style={{ width: '140px' }}>
                      <img src={alt.imageUrl} className="card-img-top" style={{ height: '70px', objectFit: 'contain' }} alt="" />
                      <div className="card-body p-1 text-center">
                        <p className="small fw-bold mb-0" style={{ fontSize: '0.75rem' }}>{alt.name}</p>
                        <p className="text-success small mb-0">₹ {alt.price}</p>
                        <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => navigate(`/product/${alt.id}`)}>View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="btn btn-warning btn-lg w-100 mt-3 fw-bold" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
          </div>
        </div>

        <hr className="my-5" />

        <div className="row">
          <div className="col-md-6">
            <h4 className="mb-4">Customer Reviews</h4>
            {feedback.length === 0 ? (
              <p className="text-muted italic">No reviews yet. Be the first to review!</p>
            ) : (
              feedback.map((f) => (
                <div key={f.id} className="card mb-3 shadow-sm border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Rating: {f.rating}/5</span>
                      <small className="text-muted">{new Date(f.createdAt).toLocaleDateString()}</small>
                    </div>
                    <p className="mb-1">{f.comment}</p>
                    <span className={`badge bg-${f.sentiment === 'POSITIVE' ? 'success' : f.sentiment === 'NEGATIVE' ? 'danger' : 'info'}`}>
                      {f.sentiment}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="col-md-6">
            <div className="card p-4 shadow-sm border-0 bg-light">
              <h4 className="mb-3">Write a Review</h4>
              <form onSubmit={handleSubmitFeedback}>
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <select
                    className="form-select"
                    value={newFeedback.rating}
                    onChange={(e) => setNewFeedback({ ...newFeedback, rating: e.target.value })}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Share your thoughts..."
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">Submit Review</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
