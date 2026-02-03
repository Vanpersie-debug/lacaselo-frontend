import React, { useEffect, useState } from "react";
import axios from "axios";

function Kitchen() {
  const [food, setFood] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ price: "", quantity: "" });

  const API_URL = "http://localhost:5000/api/food";

  // ================= Fetch all food items =================
  const fetchFood = async () => {
    try {
      const res = await axios.get(API_URL);
      setFood(res.data);
    } catch (err) {
      console.error("Error fetching food:", err);
    }
  };

  useEffect(() => {
    fetchFood();
  }, []);

  // ================= Add a new food item =================
  const handleAdd = async () => {
    const name = prompt("Food name:");
    const price = prompt("Price:");
    const quantity = prompt("Quantity:");

    if (name && price && quantity) {
      try {
        const res = await axios.post(API_URL, {
          name,
          price: Number(price),
          quantity: Number(quantity),
        });
        setFood([...food, res.data]);
      } catch (err) {
        console.error("Error adding food:", err);
      }
    }
  };

  // ================= Start editing =================
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditValues({ price: item.price, quantity: item.quantity });
  };

  // ================= Save updated food =================
  const handleSave = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        price: Number(editValues.price),
        quantity: Number(editValues.quantity),
      });

      setFood(
        food.map((item) =>
          item.id === id
            ? { ...item, price: Number(editValues.price), quantity: Number(editValues.quantity) }
            : item
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating food:", err);
    }
  };

  const handleCancel = () => setEditingId(null);

  // ================= Sell food =================
  const handleSell = async (id) => {
    const item = food.find((f) => f.id === id);
    if (!item || item.quantity === 0) return;

    const amountStr = prompt(`Enter amount of "${item.name}" sold:`);
    const amount = Number(amountStr);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid number greater than 0.");
      return;
    }

    if (amount > item.quantity) {
      alert(`Cannot sell more than available quantity (${item.quantity}).`);
      return;
    }

    try {
      await axios.post(`${API_URL}/sell/${id}`, { amount });

      // Update local state to match backend
      setFood(
        food.map((f) =>
          f.id === id
            ? { 
                ...f, 
                quantity: f.quantity - amount, 
                sold: f.sold + amount,
                total_sold_money: f.total_sold_money + amount * f.price
              }
            : f
        )
      );
    } catch (err) {
      console.error("Error selling food:", err);
    }
  };

  return (
    <div className="container mt-4">
      {/* Header + Add Button */}
      <div className="card shadow mb-4">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <h2 className="mb-2 mb-md-0">Kitchen</h2>
          <button className="btn btn-success w-100 w-md-auto" onClick={handleAdd}>
            + Add Food
          </button>
        </div>
      </div>

      {/* Food Table */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Food Name</th>
                <th>Price (RWF)</th>
                <th>Quantity</th>
                <th>Sold</th>
                <th>Total Sold Money (RWF)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {food.length === 0 ? (
                <tr>
                  <td colSpan="7">No food items available</td>
                </tr>
              ) : (
                food.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={editValues.price}
                          onChange={(e) =>
                            setEditValues({ ...editValues, price: e.target.value })
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        item.price
                      )}
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={editValues.quantity}
                          onChange={(e) =>
                            setEditValues({ ...editValues, quantity: e.target.value })
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td>{item.sold}</td>
                    <td>{item.total_sold_money}</td>
                    <td>
                      {editingId === item.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleSave(item.id)}
                          >
                            Save
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEditClick(item)}
                          >
                            Update
                          </button>
                          {item.quantity > 0 && (
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleSell(item.id)}
                            >
                              Sell
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Kitchen;
