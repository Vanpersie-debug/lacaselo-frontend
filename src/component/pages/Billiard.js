import React, { useEffect, useState } from "react";
import axios from "axios";

function Billiard() {
  const [tables, setTables] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ price_per_hour: "" });

  const API_URL = "http://localhost:5000/api/billiard";

  // Fetch billiard tables
  const fetchTables = async () => {
    try {
      const res = await axios.get(API_URL);
      setTables(res.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Add new table
  const handleAdd = async () => {
    const table_name = prompt("Enter table name:");
    const price_per_hour = prompt("Enter price per hour:");

    if (table_name && price_per_hour) {
      try {
        const res = await axios.post(API_URL, {
          table_name,
          price_per_hour: Number(price_per_hour),
        });
        setTables([...tables, res.data]);
      } catch (err) {
        console.error("Error adding table:", err);
      }
    }
  };

  // Edit table
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditValues({ price_per_hour: item.price_per_hour });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        price_per_hour: Number(editValues.price_per_hour),
      });

      setTables(
        tables.map((item) =>
          item.id === id
            ? { ...item, price_per_hour: Number(editValues.price_per_hour) }
            : item
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating table:", err);
    }
  };

  const handleCancel = () => setEditingId(null);

  // Record session
  const handlePlay = async (id) => {
    const hoursStr = prompt("Enter hours played:");
    const hours = Number(hoursStr);

    if (isNaN(hours) || hours <= 0) {
      alert("Please enter a valid number of hours.");
      return;
    }

    try {
      await axios.post(`${API_URL}/play/${id}`, { hours });
      setTables(
        tables.map((t) =>
          t.id === id
            ? {
                ...t,
                hours_played: t.hours_played + hours,
                total_income: t.total_income + hours * t.price_per_hour,
              }
            : t
        )
      );
    } catch (err) {
      console.error("Error recording session:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow mb-4">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <h2 className="mb-2 mb-md-0">Billiard Tables</h2>
          <button className="btn btn-success w-100 w-md-auto" onClick={handleAdd}>
            + Add Table
          </button>
        </div>
      </div>

      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Table Name</th>
                <th>Price/Hour (RWF)</th>
                <th>Hours Played</th>
                <th>Total Income (RWF)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.length === 0 ? (
                <tr>
                  <td colSpan="6">No billiard tables available</td>
                </tr>
              ) : (
                tables.map((table, index) => (
                  <tr key={table.id}>
                    <td>{index + 1}</td>
                    <td>{table.table_name}</td>
                    <td>
                      {editingId === table.id ? (
                        <input
                          type="number"
                          value={editValues.price_per_hour}
                          onChange={(e) =>
                            setEditValues({ price_per_hour: e.target.value })
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        table.price_per_hour
                      )}
                    </td>
                    <td>{table.hours_played}</td>
                    <td>{table.total_income}</td>
                    <td>
                      {editingId === table.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleSave(table.id)}
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
                            onClick={() => handleEditClick(table)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handlePlay(table.id)}
                          >
                            Play
                          </button>
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

export default Billiard;
