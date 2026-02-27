import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EmployeeLoans() {
  const { id } = useParams();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalLoan, setTotalLoan] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);

  const API_URL = `https://backend-vitq.onrender.com/api/employees/${id}/loans`;

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setLoans(res.data);
      recalcTotals(res.data);
    } catch (err) {
      console.error(err);
      setLoans([]);
      setTotalLoan(0);
      setTotalPaid(0);
      setTotalRemaining(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  const recalcTotals = (data) => {
    let loanSum=0, paidSum=0, remainingSum=0;
    data.forEach(l => {
      loanSum += Number(l.amount || 0);
      paidSum += Number(l.total_paid || 0);
      remainingSum += Number(l.remaining || 0);
    });
    setTotalLoan(loanSum);
    setTotalPaid(paidSum);
    setTotalRemaining(remainingSum);
  };

  const handleAddLoan = async () => {
    const amount = Number(prompt("Loan Amount:")) || 0;
    const reason = prompt("Reason (optional):") || "";
    const loan_date = prompt("Loan Date (YYYY-MM-DD):") || new Date().toISOString().split("T")[0];
    if (amount <= 0) return;

    try {
      await axios.post(API_URL, { amount, reason, loan_date });
      fetchLoans();
    } catch (err) { console.error(err); }
  };

  const handlePaidChange = async (loanId, value) => {
    try {
      await axios.put(`https://backend-vitq.onrender.com/api/employees/loans/${loanId}`, { total_paid: Number(value) });
      fetchLoans();
    } catch (err) { console.error(err); }
  };

  const formatNumber = v => Number(v||0).toLocaleString();

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="card shadow mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0">Employee Loans</h4>
          <button className="btn btn-success" onClick={handleAddLoan}>+ Add Loan</button>
        </div>
      </div>

      {/* CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow border-0" style={{ backgroundColor:"#D4AF37", color:"#000" }}>
            <div className="card-body text-center"><h6>Total Payment</h6><h4>RWF {formatNumber(totalPaid)}</h4></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0" style={{ backgroundColor:"#F28B82", color:"#000" }}>
            <div className="card-body text-center"><h6>Total Loan</h6><h4>RWF {formatNumber(totalLoan)}</h4></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0" style={{ backgroundColor:"#0E6251", color:"#fff" }}>
            <div className="card-body text-center"><h6>Total Remaining</h6><h4>RWF {formatNumber(totalRemaining)}</h4></div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr><th>#</th><th>Amount</th><th>Paid</th><th>Remaining</th><th>Reason</th><th>Date</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="6">Loading...</td></tr> :
               loans.length===0 ? <tr><td colSpan="6">No loans found</td></tr> :
               loans.map((l,i) => (
                 <tr key={l.id}>
                   <td>{i+1}</td>
                   <td>RWF {formatNumber(l.amount)}</td>
                   <td>
                     <input type="number" className="form-control form-control-sm"
                       value={l.total_paid} onChange={e=>handlePaidChange(l.id, e.target.value)}
                     />
                   </td>
                   <td className={l.remaining>=0 ? "text-success fw-bold":"text-danger fw-bold"}>
                     RWF {formatNumber(l.remaining)}
                   </td>
                   <td>{l.reason || "-"}</td>
                   <td>{l.loan_date}</td>
                 </tr>
               ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLoans;