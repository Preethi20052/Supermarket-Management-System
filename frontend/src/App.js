import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CustomerHome from "./pages/CustomerHome";
import AdminDashboard from "./pages/AdminDashboard";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import Landing from "./pages/Landing";
import CustomerAuth from "./pages/CustomerAuth";
import PaymentPage from "./pages/PaymentPage";
import SocietyJoin from "./pages/SocietyJoin";
import SocietyCreate from "./pages/SocietyCreate";
import SocietyJoinPage from "./pages/SocietyJoinPage";
import SocietyDashboard from "./pages/SocietyDashboard";
import ProductDetails from "./pages/ProductDetails";
import BudgetDashboard from "./pages/BudgetDashboard";
import PredictorDashboard from "./pages/PredictorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer/login" element={<CustomerAuth />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/community" element={<SocietyJoin />} />
        <Route path="/society/create" element={<SocietyCreate />} />
        <Route path="/society/join" element={<SocietyJoinPage />} />
        <Route path="/society/dashboard" element={<SocietyDashboard />} />
        <Route path="/budget" element={<BudgetDashboard />} />
        <Route path="/predictor" element={<PredictorDashboard />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
