import React, { useEffect, useState } from "react";
import axios from "axios";

function Kitchen() {
  const today = new Date().toISOString().split("T")[0];

  const [foods, setFoods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [totalEarned, setTotalEarned] = useState(0); // total money from sold food

  const API_URL = "https://backend-vitq.onrender.com/api/kitchen";

  // ================= FETCH FOODS =================
  const fetchFoods = async (date) => {
    try {
      const res = await axios.get(API_URL, { params: { date } });
      // Backend response: { foods: [...], totalEarned: 12345 }
      setFoods(res.data.foods || []);
      setTotalEarned(res.data.totalEarned || 0);
    } catch (err) {
      console.error("Error fetching kitchen data:", err);
      setFoods([]);
      setTotalEarned(0);
    }
  };

  useEffect(() => {
    fetchFoods(selectedDate);
  }, [selectedDate]);

  // ================= CHANGE DATE =================
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);

    const formatted = newDate.toISOString().split("T")[0];
    if (formatted > today) return; // prevent future

    setSelectedDate(formatted);
  };

  // ================= ADD FOOD =================
  const handleAdd = async () => {
    const name = prompt("Food name:");
    const price = prompt("Price:");
    const quantity = prompt("Opening stock:");

    if (!name || !price || !quantity) return;

    try {
      await axios.post(API_URL, {
        name,
        price: Number(price),
        quantity: Number(quantity),
        date: selectedDate,
      });
      fetchFoods(selectedDate);
    } catch (err) {
      console.error("Error adding food:", err);
    }
  };

  // ================= UPDATE ENTREE =================
  const handleEntreeChange = async (id, value) => {
    const entreeValue = Number(value);

    setFoods((prev) =>
      prev.map((f) => (f.id === id ? { ...f, entree: entreeValue } : f))
    );

    try {
      await axios.put(`${API_URL}/entree/${id}`, {
        entree: entreeValue,
        date: selectedDate,
      });
      fetchFoods(selectedDate); // refresh totalEarned
    } catch (err) {
      console.error("Error updating entree:", err);
    }
  };

  // ================= UPDATE SOLD =================
  const handleSoldChange = async (id, value) => {
    const soldValue = Number(value);

    setFoods((prev) =>
      prev.map((f) => (f.id === id ? { ...f, sold: soldValue } : f))
    );

    try {
      await axios.put(`${API_URL}/sold/${id}`, {
        sold: soldValue,
        date: selectedDate,
      });
      fetchFoods(selectedDate); // refresh totalEarned
    } catch (err) {
      console.error("Error updating sold:", err);
    }
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="card shadow mb-4 p-3 d-flex justify-content-between align-items-center">
        <h2>Kitchen Inventory</h2>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => changeDate(-1)}
          >
            ◀
          </button>

          <strong>{selectedDate}</strong>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => changeDate(1)}
            disabled={selectedDate === today}
          >
            ▶
          </button>

          <button
            className="btn btn-success ms-3"
            onClick={handleAdd}
          >
            + Add Food
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Food</th>
                <th>Price (RWF)</th>
                <th>Opening Stock</th>
                <th>Entree</th>
                <th>Total Stock</th>
                <th>Sold</th>
                <th>Total Sold (RWF)</th>
                <th>Closing Stock</th>
              </tr>
            </thead>

            <tbody>
              {foods.length === 0 ? (
                <tr>
                  <td colSpan="9">No food items for this date</td>
                </tr>
              ) : (
                foods.map((food, index) => {
                  const openingStock = Number(food.quantity);
                  const entree = Number(food.entree || 0);
                  const sold = Number(food.sold || 0);
                  const price = Number(food.price);

                  const totalStock = openingStock + entree;
                  const totalSold = sold * price;
                  const closingStock = totalStock - sold;

                  return (
                    <tr key={food.id}>
                      <td>{index + 1}</td>
                      <td>{food.name}</td>
                      <td>{price}</td>
                      <td>{openingStock}</td>

                      {/* ENTREE INPUT */}
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={entree}
                          onChange={(e) =>
                            handleEntreeChange(food.id, e.target.value)
                          }
                        />
                      </td>

                      {/* TOTAL STOCK */}
                      <td>{totalStock}</td>

                      {/* SOLD INPUT */}
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={sold}
                          onChange={(e) =>
                            handleSoldChange(food.id, e.target.value)
                          }
                        />
                      </td>

                      {/* TOTAL SOLD */}
                      <td>{totalSold}</td>

                      {/* CLOSING STOCK */}
                      <td>{closingStock}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOTAL EARNED */}
      <div className="mt-2 text-end fw-bold fs-5">
        Total Earned (RWF): {totalEarned}
      </div>
    </div>
  );
}

export default Kitchen;