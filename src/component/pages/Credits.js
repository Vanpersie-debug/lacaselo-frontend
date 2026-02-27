import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EmployeeLoans() {
  const { id } = useParams();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = `https://backend-vitq.onrender.com/api/employees/${id}/loans`;

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setLoans(res.data);
    } catch (err) {
      console.error(err);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAddLoan = async () => {
    const amount = Number(prompt("Loan Amount:")) || 0;
    if (amount <= 0) return;

    try {
      await axios.post(API_URL, { loan_amount: amount });
      fetchLoans();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaidChange = async (loanId, value) => {
    const paid = Number(value) || 0;
    try {
      await axios.put(`https://backend-vitq.onrender.com/api/employees/loans/${loanId}`, { paid_amount: paid });
      fetchLoans();
    } catch (err) {
      console.error(err);
    }
  };

  const formatNumber = (value) => Number(value || 0).toLocaleString();

  return (
    <div className="container mt-4">

      {/* ===== HEADER ===== */}
      <div className="card shadow mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0">Employee Loans</h4>
          <button className="btn btn-success" onClick={handleAddLoan}>
            + Add Loan
          </button>
        </div>
      </div>

      {/* ===== LOANS TABLE ===== */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Loan Amount</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5">Loading...</td></tr>
              ) : loans.length === 0 ? (
                <tr><td colSpan="5">No loans found</td></tr>
              ) : (
                loans.map((l, i) => (
                  <tr key={l.id}>
                    <td>{i + 1}</td>
                    <td>RWF {formatNumber(l.loan_amount)}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={l.paid_amount}
                        onChange={(e) => handlePaidChange(l.id, e.target.value)}
                      />
                    </td>
                    <td className={l.remaining >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                      RWF {formatNumber(l.remaining)}
                    </td>
                    <td>{l.loan_date}</td>
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

export default EmployeeLoans;