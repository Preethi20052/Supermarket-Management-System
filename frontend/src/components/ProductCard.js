
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100 shadow-sm">
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.name}
          style={{ cursor: "pointer", height: "200px", objectFit: "contain" }}
          onClick={() => navigate(`/product/${product.id}`)}
        />
        <div className="card-body">
          <h6>{product.name}</h6>
          <p>₹ {product.price}</p>
          <button
            className="btn btn-warning w-100"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
