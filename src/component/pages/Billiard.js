import React, { useEffect, useState } from "react";
import axios from "axios";

function Billiard() {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState("");
  const [token, setToken] = useState("");
  const [cash, setCash] = useState("");
  const [cashMomo, setCashMomo] = useState("");

  const API_URL = "https://backend-vitq.onrender.com/api/billiard";

  // Fetch all records
  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching billiard records:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add new record
  const handleSubmit = async () => {
    if (!date || token < 0 || cash < 0 || cashMomo < 0) {
      alert("Fill all fields correctly");
      return;
    }

    try {
      await axios.post(API_URL, {
        date,
        token: Number(token),
        cash: Number(cash),
        cash_momo: Number(cashMomo),
      });

      // Reset inputs
      setDate("");
      setToken("");
      setCash("");
      setCashMomo("");

      fetchData();
    } catch (err) {
      console.error("Error adding billiard record:", err);
    }
  };

  // Calculate daily totals
  const totalToken = records.reduce((sum, r) => sum + (r.token || 0), 0);
  const totalCash = records.reduce((sum, r) => sum + (r.cash || 0), 0);
  const totalMomo = records.reduce((sum, r) => sum + (r.cash_momo || 0), 0);
  const grandTotal = records.reduce((sum, r) => sum + (r.total || 0), 0);

  return (
    <div className="container mt-4">
      {/* Input Form */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3 className="mb-3">Billiard Daily Record</h3>
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Token"
                value={token}
                onChange={e => setToken(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Cash (RWF)"
                value={cash}
                onChange={e => setCash(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Cash (MOMO)"
                value={cashMomo}
                onChange={e => setCashMomo(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button className="btn btn-success w-100" onClick={handleSubmit}>
                Add Record
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Token</th>
                <th>Cash (RWF)</th>
                <th>Cash (MOMO)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6">No billiard records</td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.date}</td>
                    <td>{r.token || 0}</td>
                    <td>{r.cash || 0}</td>
                    <td>{r.cash_momo || 0}</td>
                    <td>{r.total || 0}</td>
                  </tr>
                ))
              )}

              {/* Daily Summary */}
              {records.length > 0 && (
                <tr className="table-secondary fw-bold">
                  <td colSpan="2">Daily Summary</td>
                  <td>{totalToken}</td>
                  <td>{totalCash}</td>
                  <td>{totalMomo}</td>
                  <td>{grandTotal}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Billiard;