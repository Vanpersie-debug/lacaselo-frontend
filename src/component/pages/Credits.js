import React, { useEffect, useState } from "react";
import axios from "axios";

function Credits() {
  const [credits, setCredits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const [totalPayment, setTotalPayment] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);

  const API_URL = "https://backend-vitq.onrender.com/api/credits";

  // ===== FETCH DATA =====
  const fetchCredits = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      const data = res.data || [];
      setCredits(data);
      recalcTotals(data);
    } catch (err) {
      console.error("Error fetching credits:", err);
      setCredits([]);
      setTotalPayment(0);
      setTotalCredit(0);
      setTotalRemaining(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  // ===== RECALCULATE TOTALS =====
  const recalcTotals = (data) => {
    let paymentSum = 0;
    let creditSum = 0;
    let remainingSum = 0;

    data.forEach((c) => {
      paymentSum += Number(c.payment || 0);
      creditSum += Number(c.credit || 0);
      remainingSum += Number(c.remaining || 0);
    });

    setTotalPayment(paymentSum);
    setTotalCredit(creditSum);
    setTotalRemaining(remainingSum);
  };

  // ===== ADD NEW CREDIT =====
  const handleAdd = async () => {
    const name = prompt("Customer Name:");
    const payment = Number(prompt("Payment:")) || 0;
    const credit = Number(prompt("Credit:")) || 0;

    if (!name.trim()) return alert("Name is required");

    try {
      const res = await axios.post(API_URL, { name, payment, credit });
      const newCredits = [res.data, ...credits];
      setCredits(newCredits);
      recalcTotals(newCredits);
    } catch (err) {
      console.error("Error adding credit:", err);
    }
  };

  // ===== HANDLE EDIT =====
  const handleChange = (id, field, value) => {
    const numValue = Number(value);
    const updatedCredits = credits.map((c) =>
      c.id === id ? { ...c, [field]: numValue } : c
    );
    setCredits(updatedCredits);
    recalcTotals(updatedCredits);

    axios.put(`${API_URL}/${id}`, { [field]: numValue }).catch((err) =>
      console.error(`Error updating ${field}:`, err)
    );
  };

  const formatNumber = (value) => Number(value || 0).toLocaleString();

  return (
    <div className="container mt-4">

      {/* ===== SUMMARY CARDS ===== */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card text-white shadow border-0" style={{ backgroundColor: "#0B3D2E" }}>
            <div className="card-body text-center">
              <h6>Total Payment</h6>
              <h4>RWF {formatNumber(totalPayment)}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0" style={{ backgroundColor: "#D4AF37", color: "#000" }}>
            <div className="card-body text-center">
              <h6>Total Credit</h6>
              <h4>RWF {formatNumber(totalCredit)}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white shadow border-0" style={{ backgroundColor: "#0E6251" }}>
            <div className="card-body text-center">
              <h6>Total Remaining</h6>
              <h4>RWF {formatNumber(totalRemaining)}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* ===== HEADER ===== */}
      <div className="card shadow mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0">Credits</h4>
          <button className="btn btn-success" onClick={handleAdd}>
            + Add Credit
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Payment</th>
                <th>Credits</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5">Loading...</td></tr>
              ) : credits.length === 0 ? (
                <tr><td colSpan="5">No credit entries found</td></tr>
              ) : (
                credits.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.name}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={c.payment}
                        onChange={(e) => handleChange(c.id, "payment", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={c.credit}
                        onChange={(e) => handleChange(c.id, "credit", e.target.value)}
                      />
                    </td>
                    <td className={c.remaining >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {formatNumber(c.remaining)}
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

export default Credits;