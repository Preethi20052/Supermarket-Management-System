import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/home">SuperMart</Link>

      <input
        className="form-control mx-4"
        style={{ width: "35%" }}
        placeholder="Search for products"
      />

      <div className="ms-auto d-flex align-items-center">
        {user ? (
          <>
            <div className="dropdown d-inline-block me-2">
              <button className="btn btn-outline-info dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Society
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/society/dashboard">My Dashboard</Link></li>
                <li><Link className="dropdown-item" to="/society/create">Create Society</Link></li>
                <li><Link className="dropdown-item" to="/society/join">Join Society</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/community">Bulk Ordering</Link></li>
              </ul>
            </div>
            <Link to="/budget" className="btn btn-outline-success me-2">Budget</Link>
            <Link to="/predictor" className="btn btn-outline-primary me-2">AI Predictor</Link>
            <Link to="/cart" className="btn btn-warning me-2">Cart</Link>
            <Link to="/orders" className="btn btn-outline-light me-2">Orders</Link>
            <span className="text-light me-3 small">Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
