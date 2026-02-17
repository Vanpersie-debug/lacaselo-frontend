import React, { useEffect, useState } from "react";
import axios from "axios";

function GuestHouse() {
  const [dates, setDates] = useState([]);
  const API_URL = "https://backend-vitq.onrender.com/api/guesthouse";

  const fetchDates = async () => {
    try {
      const res = await axios.get(API_URL);
      setDates(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchDates(); }, []);

  const handleAdd = async () => {
    const date = prompt("Enter date (YYYY-MM-DD):");
    const vip = prompt("Number of VIP rooms:");
    const normal = prompt("Number of Normal rooms:");
    const price = prompt("Enter price per night (RWF):");

    if (!date || vip === null || normal === null || !price) return alert("All fields required");

    try {
      await axios.post(API_URL, { date, vip: Number(vip), normal: Number(normal), price: Number(price) });
      fetchDates();
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (id) => {
    const price = prompt("Enter new price per night (RWF):");
    if (!price) return;
    try { await axios.put(`${API_URL}/update/${id}`, { price }); fetchDates(); } catch (err) { console.error(err); }
  };

  const handleOccupied = async (id) => {
    try { await axios.put(`${API_URL}/occupy/${id}`); fetchDates(); } catch (err) { console.error(err); }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow mb-4 d-flex justify-content-between align-items-center p-3">
        <h2>Guest House</h2>
        <button className="btn btn-success" onClick={handleAdd}>+ Add Date</button>
      </div>

      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>VIP Rooms</th>
                <th>Normal Rooms</th>
                <th>Total Rooms</th>
                <th>Price (RWF)</th>
              </tr>
            </thead>
            <tbody>
              {dates.length === 0 ? (
                <tr><td colSpan="8">No dates available</td></tr>
              ) : (
                dates.map((d, i) => (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td>{d.date}</td>
                    <td>{d.vip}</td>
                    <td>{d.normal}</td>
                    <td>{d.vip + d.normal}</td>
                    <td>{d.price}</td>
                    {/* <td>
                      <span className={`badge ${d.status === "Available" ? "bg-success" : "bg-danger"}`}>
                        {d.status}
                      </span>
                    </td> */}
                    {/* <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleUpdate(d.id)}>Update</button>
                      {d.status === "Available" && <button className="btn btn-sm btn-warning" onClick={() => handleOccupied(d.id)}>Occupy</button>}
                    </td> */}
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

export default GuestHouse;