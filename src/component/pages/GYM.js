import React, { useEffect, useState } from "react";
import axios from "axios";

function Gym() {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState("");
  const [dailyPeople, setDailyPeople] = useState("");
  const [monthlyPeople, setMonthlyPeople] = useState("");
  const [totalPeople, setTotalPeople] = useState("");
  const [cash, setCash] = useState("");
  const [cashMomo, setCashMomo] = useState("");

  const API_URL = "http://localhost:5000/api/gym";

  // Fetch all records
  const loadData = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching gym records:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add new record
  const handleSubmit = async () => {
    if (
      !date ||
      dailyPeople <= 0 ||
      monthlyPeople <= 0 ||
      totalPeople <= 0 ||
      cash < 0 ||
      cashMomo < 0
    ) {
      alert("Please fill all fields correctly");
      return;
    }

    try {
      await axios.post(API_URL, {
        date,
        daily_people: Number(dailyPeople),
        monthly_people: Number(monthlyPeople),
        total_people: Number(totalPeople),
        cash: Number(cash),
        cash_momo: Number(cashMomo),
      });

      // Reset inputs
      setDate("");
      setDailyPeople("");
      setMonthlyPeople("");
      setTotalPeople("");
      setCash("");
      setCashMomo("");

      // Reload data
      loadData();
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  return (
    <div className="container mt-4">
      {/* FORM */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3>Gym Daily Records</h3>

          <input
            type="date"
            className="form-control mb-2"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Daily People"
            value={dailyPeople}
            onChange={e => setDailyPeople(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Monthly People"
            value={monthlyPeople}
            onChange={e => setMonthlyPeople(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Total People"
            value={totalPeople}
            onChange={e => setTotalPeople(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Cash (RWF)"
            value={cash}
            onChange={e => setCash(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Cash (MOMO)"
            value={cashMomo}
            onChange={e => setCashMomo(e.target.value)}
          />

          <button className="btn btn-success w-100" onClick={handleSubmit}>
            Add Record
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Daily People</th>
                <th>Monthly People</th>
                <th>Total People</th>
                <th>Cash (RWF)</th>
                <th>Cash (MOMO)</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="7">No records found</td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr key={r.id || i}>
                    <td>{i + 1}</td>
                    <td>{r.date}</td>
                    <td>{r.daily_people || 0}</td>
                    <td>{r.monthly_people || 0}</td>
                    <td>{r.total_people || 0}</td>
                    <td>{r.cash || 0}</td>
                    <td>{r.cash_momo || 0}</td>
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

export default Gym;