import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import { useNavigate } from "react-router-dom";
import NearExpiryDeals from "../components/NearExpiryDeals";
import Navbar from "../components/Navbar";

function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    getProducts().then((res) => setProducts(res.data)).catch(err => console.error("Error loading products:", err));
  };

  const handleAddToCart = (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    const quantity = prompt("Enter quantity:", 1);
    if (!quantity) return;

    addToCart(productId, quantity)
      .then(() => alert("Added to Cart ✅"))
      .catch((err) => {
        console.error("Cart Add Error:", err);
        alert("Error adding to cart - see console");
      });
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => (maxPrice === "" ? true : p.price <= parseFloat(maxPrice)))
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <div>
      <Navbar />



      <div className="container mt-4">
        <NearExpiryDeals />
        {/* Search, Filter, Sort Controls */}
        <div className="row mb-4 g-3 bg-white p-3 rounded shadow-sm mx-0">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="💰 Max Price (₹)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="none">Sort By Price</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="row">
          {filteredProducts.length === 0 ? (
            <div className="col-12 text-center py-5">
              <h4 className="text-muted">No products found matching your criteria</h4>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div className="col-md-3 mb-4" key={p.id}>
                <div className="card shadow h-100">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5>{p.name}</h5>
                    <p className="text-success fw-bold">₹ {p.price}</p>
                    <p>Stock: {p.stock}</p>

                    <button
                      className="btn btn-warning mt-auto"
                      onClick={() => handleAddToCart(p.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )))}
        </div>
      </div>
    </div>
  );
}

export default CustomerHome;
