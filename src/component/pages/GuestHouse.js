import React, { useEffect, useState } from "react";
import axios from "axios";

function GuestHouse() {
  const [dates, setDates] = useState([]);

  // FETCH DATA FROM DATABASE
  const fetchDates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/guesthouse");
      setDates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);

  // ADD DATE
  const handleAdd = async () => {
    const date = prompt("Enter date (YYYY-MM-DD):");
    const price = prompt("Enter price for the night:");
    if (date && price) {
      try {
        await axios.post("http://localhost:5000/api/guesthouse", { date, price });
        fetchDates();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // UPDATE PRICE
  const handleUpdate = async (id) => {
    const price = prompt("Enter new price for the night:");
    if (price) {
      try {
        await axios.put(`http://localhost:5000/api/guesthouse/update/${id}`, { price });
        fetchDates();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // MARK AS OCCUPIED
  const handleOccupied = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/guesthouse/occupy/${id}`);
      fetchDates();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <h2 className="mb-2 mb-md-0">Guest House</h2>
          <form className="d-flex w-100 w-md-auto mt-2 mt-md-0">
            <input className="form-control me-2" type="search" placeholder="Search date" />
            <button className="btn btn-outline-success" type="button">Search</button>
          </form>
        </div>
      </div>

      <div className="card shadow mt-4">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
          <h5 className="mb-2 mb-md-0">Dates</h5>
          <button className="btn btn-success w-100 w-md-auto" onClick={handleAdd}>+ Add Date</button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Price / Night (RWF)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dates.length === 0 ? (
                <tr>
                  <td colSpan="5">No dates available</td>
                </tr>
              ) : (
                dates.map((d, index) => (
                  <tr key={d.id}>
                    <td>{index + 1}</td>
                    <td>{d.date}</td>
                    <td>{d.price}</td>
                    <td>
                      {d.status === "Available" ? (
                        <span className="badge bg-success">Available</span>
                      ) : (
                        <span className="badge bg-danger">Occupied</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleUpdate(d.id)}>Update</button>
                      {d.status === "Available" && (
                        <button className="btn btn-sm btn-warning" onClick={() => handleOccupied(d.id)}>Occupied</button>
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

export default GuestHouse;
