import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  // CHANGE THIS LATER WHEN HOSTED
  const API_BASE = "https://backend-vitq.onrender.com/api";

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const res = await axios.get(`${API_BASE}/total-money`);

      const {
        drinks,
        kitchen,
        billiard,
        gym,
        guesthouse,
        expenses,
      } = res.data;

      // GRAND TOTAL (expenses excluded)
      const grandTotal =
        drinks + kitchen + billiard + gym + guesthouse;

      setTotals({
        drinks,
        kitchen,
        billiard,
        gym,
        guesthouse,
        expenses,
        grandTotal,
      });
    } catch (error) {
      console.error("Failed to load totals:", error);
    }
  };

  const pages = [
    { name: "Drinks", key: "drinks", route: "/bar" },
    { name: "Kitchen", key: "kitchen", route: "/kitchen" },
    { name: "Billiard", key: "billiard", route: "/billiard" },
    { name: "Gym", key: "gym", route: "/gym" },
    { name: "Guest House", key: "guesthouse", route: "/guesthouse" },
    { name: "Expenses", key: "expenses", route: "/expenses" },
  ];

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">
          Business Dashboard 💰
        </h2>

        <div className="row">
          {pages.map((page) => (
            <div
              key={page.key}
              className="col-12 col-md-4 mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(page.route)}
            >
              <div className="card shadow-sm p-3 text-center">
                <h5>{page.name}</h5>
                <h3>
                  {totals[page.key].toLocaleString()} RWF
                </h3>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <div className="card bg-success text-white p-4 text-center">
          <h4>Total Profit (Expenses Excluded)</h4>
          <h1>
            {totals.grandTotal.toLocaleString()} RWF
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
