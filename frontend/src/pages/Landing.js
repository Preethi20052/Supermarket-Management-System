// import { useNavigate } from "react-router-dom";
// import "./Landing.css";

// function Landing() {
//   const navigate = useNavigate();

//   return (
//     <div className="landing">
//       <div className="overlay">
//         <h1>Welcome to SuperMart</h1>
//         <p>Your daily groceries, delivered fast</p>
//         <button onClick={() => navigate("/login")}>
//           Get Started
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Landing;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Landing.css";
// import supermarketImg from "../assets/supermarket.jpg";

// function Landing() {
//   const navigate = useNavigate();
//   return (
//     <div
//       className="hero"
//       style={{ backgroundImage: `url(${supermarketImg})` }}
//     >
//       <div className="hero-content">
//         <h1>Welcome to SuperMart</h1>
//          <p>Your daily groceries, delivered fast</p>
//         <button onClick={() => navigate("/login")}>
//           Get Started
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Landing;
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import Home from "./pages/Home";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/home" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { useNavigate } from "react-router-dom";
import supermarketBg from "../assets/supermarket.jpg";

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-white position-relative"
      style={{
        backgroundImage: `url(${supermarketBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background: 'linear-gradient(135deg, rgba(35, 47, 62, 0.85) 0%, rgba(19, 25, 33, 0.90) 100%)',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      ></div>

      {/* Content */}
      <div className="position-relative" style={{ zIndex: 2 }}>
        <div className="text-center mb-5">
          <h1
            className="display-3 fw-bold mb-3"
            style={{
              textShadow: '2px 4px 8px rgba(0,0,0,0.5)',
              letterSpacing: '2px'
            }}
          >
            Welcome to SuperMart
          </h1>
          <p
            className="lead fs-4 mb-4"
            style={{
              textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
              color: '#ffc107'
            }}
          >
            Your Daily Groceries, Delivered Fresh & Fast
          </p>
        </div>

        <div className="d-flex flex-column gap-3 align-items-center">
          <button
            className="btn btn-warning px-5 py-3 fw-bold shadow-lg"
            onClick={() => navigate("/login")}
            style={{
              fontSize: '1.1rem',
              borderRadius: '10px',
              minWidth: '280px',
              transition: 'all 0.3s ease',
              border: '2px solid #ffc107'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 20px rgba(255, 193, 7, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
            }}
          >
            🔐 Admin Login
          </button>

          <button
            className="btn btn-primary px-5 py-3 fw-bold shadow-lg"
            onClick={() => navigate("/customer/login")}
            style={{
              fontSize: '1.1rem',
              borderRadius: '10px',
              minWidth: '280px',
              transition: 'all 0.3s ease',
              backgroundColor: '#0d6efd',
              border: '2px solid #0d6efd'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 20px rgba(13, 110, 253, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
            }}
          >
            🛒 Customer Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
