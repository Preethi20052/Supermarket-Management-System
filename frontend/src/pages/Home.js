// import Navbar from "../components/Navbar";
// import ProductCard from "../components/ProductCard";

// const products = [
//   { id: 1, name: "Fresh Apples", price: 120, imageUrl: "/apple.jpg" },
//   { id: 2, name: "Lays Chips", price: 30, imageUrl: "/lays.jpg" },
//   { id: 3, name: "Amul Milk", price: 60, imageUrl: "/milk.jpg" },
//   { id: 4, name: "Coca Cola", price: 45, imageUrl: "/coke.jpg" },
// ];

// // function Home() {
// //   return (
// //     <>
// //       <Navbar />
// //       <div className="container mt-4">
// //         <h4>Featured Products</h4>
// //         <div className="row">
// //           {products.map(p => (
// //             <ProductCard key={p.id} product={p} />
// //           ))}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // export default Home;
// // function Home() {
// //   return (
// //     <div
// //       className="home-banner d-flex align-items-center"
// //       style={{
// //         backgroundImage: `url(${banner})`
// //       }}
// //     >
// //       <div className="container text-white">
// //         <h1 className="display-4 fw-bold">Big Deals on Groceries!</h1>
// //         <p className="lead">Up to 50% Off on Daily Essentials</p>
// //         <button className="btn btn-warning btn-lg mt-3">
// //           Shop Now
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;
// import React from "react";
// import "../App.css";

// function Home() {
//   return (
//     <div className="home-page text-white">
//       <div className="container py-5">
//         <h1 className="display-4 fw-bold">
//           Big Deals on Groceries!
//         </h1>
//         <p className="lead">
//           Up to 50% Off on Daily Essentials
//         </p>
//         <button className="btn btn-warning btn-lg mt-3">
//           Shop Now
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Home;

// import React from "react";
// import "../App.css";

// function Home() {
//   return (
//     <div className="amazon-home">

//       {/* HERO SECTION */}
//       <div className="hero-section text-white d-flex align-items-center">
//         <div className="container">
//           <h1 className="fw-bold display-4">
//             Big Deals on Groceries!
//           </h1>
//           <p className="lead">
//             Up to 50% Off on Daily Essentials
//           </p>
//           <button className="btn btn-warning btn-lg mt-3">
//             Shop Now
//           </button>
//         </div>
//       </div>

//       {/* PRODUCTS SECTION */}
//       <div className="container py-5">
//         <h3 className="mb-4">Featured Products</h3>

//         <div className="row">
//           {[1,2,3,4].map((item) => (
//             <div className="col-md-3 mb-4" key={item}>
//               <div className="card product-card shadow-sm">
//                 <img
//                   src="https://via.placeholder.com/200"
//                   className="card-img-top"
//                   alt="product"
//                 />
//                 <div className="card-body">
//                   <h6 className="card-title">Product Name</h6>
//                   <p className="text-success fw-bold">₹199</p>
//                   <button className="btn btn-warning w-100">
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Home;
// import React, { useEffect, useState } from "react";
// import { getProducts } from "../services/productService";
// import { placeOrder } from "../services/orderService";

// function Home() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const loadProducts = () => {
//     getProducts().then((res) => setProducts(res.data));
//   };

//   const handleOrder = (id) => {
//     placeOrder(id, 1).then(() => {
//       alert("Order placed!");
//       loadProducts();
//     });
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center mb-4">Customer View</h2>

//       <div className="row">
//         {products.map((p) => (
//           <div className="col-md-3 mb-4" key={p.id}>
//             <div className="card shadow">
//               <img src={p.imageUrl} alt="" className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
//               <div className="card-body">
//                 <h5>{p.name}</h5>
//                 <p>₹ {p.price}</p>
//                 <p>Stock: {p.stock}</p>

//                 <button
//                   className="btn btn-warning w-100"
//                   disabled={p.stock === 0}
//                   onClick={() => handleOrder(p.id)}
//                 >
//                   {p.stock === 0 ? "Out of Stock" : "Order Now"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Home;

import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert("Added to cart");
  };

  return (
    <div>
      {/* Amazon Navbar */}
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold text-warning">
          SuperMart
        </span>
        <span className="text-white">Cart: {cart.length}</span>
      </nav>

      <div className="container mt-4">
        <div className="row">
          {products.map((p) => (
            <div className="col-md-3 mb-4" key={p.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={p.imageUrl}
                  alt=""
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h6>{p.name}</h6>
                  <h5 className="text-success">₹ {p.price}</h5>
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => addToCart(p)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
