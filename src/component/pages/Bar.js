import React, { useEffect, useState } from "react";
import axios from "axios";

function Bar() {
  const [drinks, setDrinks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ price: "", quantity: "" });

  const API_URL = "http://localhost:5000/api/drinks"; // backend endpoint

  // fetch all drinks
  const fetchDrinks = async () => {
    try {
      const res = await axios.get(API_URL);
      setDrinks(res.data);
    } catch (err) {
      console.error("Error fetching drinks:", err);
    }
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  // add a new drink
  const handleAdd = async () => {
    const name = prompt("Drink name:");
    const price = prompt("Price:");
    const quantity = prompt("Quantity:");

    if (name && price && quantity) {
      try {
        const res = await axios.post(API_URL, {
          name,
          price: Number(price),
          quantity: Number(quantity),
        });
        setDrinks([...drinks, res.data]);
      } catch (err) {
        console.error("Error adding drink:", err);
      }
    }
  };

  // start editing a row
  const handleEditClick = (drink) => {
    setEditingId(drink.id);
    setEditValues({ price: drink.price, quantity: drink.quantity });
  };

  // save edited row
  const handleSave = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        price: Number(editValues.price),
        quantity: Number(editValues.quantity),
      });

      setDrinks(
        drinks.map((drink) =>
          drink.id === id
            ? { ...drink, price: Number(editValues.price), quantity: Number(editValues.quantity) }
            : drink
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating drink:", err);
    }
  };

  const handleCancel = () => setEditingId(null);

  // sell a drink
  const handleSell = async (id) => {
    const drink = drinks.find((d) => d.id === id);
    if (!drink || drink.quantity === 0) return;

    const amountStr = prompt(`Enter amount of "${drink.name}" sold:`);
    const amount = Number(amountStr);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid number greater than 0.");
      return;
    }

    if (amount > drink.quantity) {
      alert(`Cannot sell more than available quantity (${drink.quantity}).`);
      return;
    }

    try {
      await axios.post(`${API_URL}/sell/${id}`, { amount });
      setDrinks(
        drinks.map((d) =>
          d.id === id
            ? { ...d, quantity: d.quantity - amount, sold: d.sold + amount }
            : d
        )
      );
    } catch (err) {
      console.error("Error selling drink:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow mb-4">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <h2 className="mb-2 mb-md-0">Bar</h2>
          <button className="btn btn-success w-100 w-md-auto" onClick={handleAdd}>
            + Add Drink
          </button>
        </div>
      </div>

      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Drink Name</th>
                <th>Price (RWF)</th>
                <th>Quantity</th>
                <th>Sold</th>
                <th>Total Sold (RWF)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drinks.length === 0 ? (
                <tr>
                  <td colSpan="7">No drinks available</td>
                </tr>
              ) : (
                drinks.map((drink, index) => (
                  <tr key={drink.id}>
                    <td>{index + 1}</td>
                    <td>{drink.name}</td>
                    <td>
                      {editingId === drink.id ? (
                        <input
                          type="number"
                          value={editValues.price}
                          onChange={(e) =>
                            setEditValues({ ...editValues, price: e.target.value })
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        drink.price
                      )}
                    </td>
                    <td>
                      {editingId === drink.id ? (
                        <input
                          type="number"
                          value={editValues.quantity}
                          onChange={(e) =>
                            setEditValues({ ...editValues, quantity: e.target.value })
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        drink.quantity
                      )}
                    </td>
                    <td>{drink.sold}</td>
                    <td>{drink.sold * drink.price}</td>
                    <td>
                      {editingId === drink.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleSave(drink.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEditClick(drink)}
                          >
                            Update
                          </button>
                          {drink.quantity > 0 && (
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleSell(drink.id)}
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

export default Bar;
