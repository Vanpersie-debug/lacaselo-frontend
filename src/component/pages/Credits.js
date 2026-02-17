import React, { useEffect, useState } from "react";
import axios from "axios";

function Credits() {
  const [credits, setCredits] = useState([]);
  const [name, setName] = useState("");
  const [payment, setPayment] = useState("");
  const [credit, setCredit] = useState("");

  const API_URL = "https://backend-vitq.onrender.com/api/credits";

  // ================= FETCH DATA =================
  const fetchCredits = async () => {
    try {
      const res = await axios.get(API_URL);
      setCredits(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  // ================= ADD NEW CREDIT =================
  const handleAdd = async () => {
    const paymentValue = Number(payment);
    const creditValue = Number(credit);

    if (!name.trim() || isNaN(paymentValue) || isNaN(creditValue)) {
      alert("Please fill all fields correctly");
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        name,
        payment: paymentValue,
        credit: creditValue,
      });

      // Add new record to state
      setCredits([res.data, ...credits]);

      // Clear inputs
      setName("");
      setPayment("");
      setCredit("");
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  return (
    <div className="container mt-4">

      {/* ================= FORM ================= */}
      <div className="card shadow mb-4 p-3">
        <h3 className="mb-3">Credits Management</h3>

        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Credits"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <button className="btn btn-success w-100" onClick={handleAdd}>
              Add Credit
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle mb-0">
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
              {credits.length === 0 ? (
                <tr>
                  <td colSpan="5">No credits found</td>
                </tr>
              ) : (
                credits.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.payment}</td>
                    <td>{c.credit}</td>
                    <td className={c.remaining >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {c.remaining}
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