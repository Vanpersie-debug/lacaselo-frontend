import { useEffect, useState } from "react";
import axios from "axios";

function Gym() {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState("");
  const [cash, setCash] = useState("");

  // FETCH DATA
  const loadData = () => {
    axios.get("http://localhost:5000/api/gym")
      .then(res => setRecords(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  // ADD RECORD
  const handleSubmit = () => {
    if (!date || !cash) return alert("Fill all fields");

    axios.post("http://localhost:5000/api/gym", {
      date,
      cash
    }).then(() => {
      setDate("");
      setCash("");
      loadData();
    });
  };

  return (
    <div className="container mt-4">

      <div className="card shadow mb-3">
        <div className="card-body">
          <h3>Gym Daily Cash</h3>

          <input
            type="date"
            className="form-control mb-2"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <input
            type="number"
            className="form-control mb-2"
            placeholder="Cash (RWF)"
            value={cash}
            onChange={e => setCash(e.target.value)}
          />

          <button className="btn btn-success w-100" onClick={handleSubmit}>
            Add Cash
          </button>
        </div>
      </div>

      <div className="card shadow">
        <table className="table table-bordered text-center mb-0">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Cash (RWF)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.date}</td>
                <td>{r.cash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Gym;
