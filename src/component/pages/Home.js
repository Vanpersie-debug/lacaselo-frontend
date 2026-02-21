import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGlassMartiniAlt, FaUtensils, FaTableTennis, FaDumbbell, FaBed, FaMoneyBillWave } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const [totals, setTotals] = useState({
    drinks: 0,
    kitchen: 0,
    billiard: 0,
    gym: 0,
    guesthouse: 0,
    expenses: 0,
    grandTotal: 0,
  });

  const API_BASE = "https://backend-vitq.onrender.com/api";

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const res = await axios.get(`${API_BASE}/total-money`);
      const { drinks, kitchen, billiard, gym, guesthouse, expenses } = res.data;
      const grandTotal = drinks + kitchen + billiard + gym + guesthouse;

      setTotals({ drinks, kitchen, billiard, gym, guesthouse, expenses, grandTotal });
    } catch (error) {
      console.error("Failed to load totals:", error);
    }
  };

  const pages = [
    { name: "Drinks", key: "drinks", route: "/bar", icon: <FaGlassMartiniAlt size={40} /> },
    { name: "Kitchen", key: "kitchen", route: "/kitchen", icon: <FaUtensils size={40} /> },
    { name: "Billiard", key: "billiard", route: "/billiard", icon: <FaTableTennis size={40} /> },
    { name: "Gym", key: "gym", route: "/gym", icon: <FaDumbbell size={40} /> },
    { name: "Guest House", key: "guesthouse", route: "/guesthouse", icon: <FaBed size={40} /> },
    { name: "Expenses", key: "expenses", route: "/expenses", icon: <FaMoneyBillWave size={40} /> },
  ];

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-primary">La Cielo GARDEN </h1>
        <p className="text-muted">Overview of all sections and profits</p>
      </div>

      {/* SECTION CARDS */}
      <div className="row g-3">
        {pages.map((page) => (
          <div key={page.key} className="col-12 col-md-4">
            <div
              className="card shadow-lg p-4 text-center h-100 border-0"
              style={{
                cursor: "pointer",
                transition: "transform 0.2s",
                background: "linear-gradient(135deg, #56949b 0%, #082e0a 100%)",
                color: "white",
              }}
              onClick={() => navigate(page.route)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="mb-3">{page.icon}</div>
              <h5 className="fw-bold">{page.name}</h5>
              <h3 className="fw-bold mt-2">{totals[page.key].toLocaleString()} RWF</h3>
            </div>
          </div>
        ))}
      </div>

      {/* GRAND TOTAL */}
      <div className="mt-4">
        <div
          className="card shadow-lg text-white p-5"
          style={{
            background: "linear-gradient(90deg, #6a8324, #0e3410)",
          }}
        >
          <h3 className="text-center fw-bold">Total Profit (Expenses Excluded)</h3>
          <h1 className="text-center display-4 fw-bold mt-3">{totals.grandTotal.toLocaleString()} RWF</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;