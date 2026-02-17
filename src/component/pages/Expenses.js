import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [activeTable, setActiveTable] = useState("bar");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    expense_name: "",
    amount: "",
    date: "",
    is_profit: 0,
    category: "",
  });

  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/expenses";

  // ================= FETCH =================
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ================= ADD =================
  const handleAdd = async () => {
    const expense_name = prompt("Expense Name:");
    const amount = Number(prompt("Amount:"));
    const date = prompt("Date (YYYY-MM-DD):");

    const category = activeTable;
    const is_profit = category === "unprofitable" ? 0 : 1;

    if (!expense_name || isNaN(amount) || !date) {
      alert("Invalid input");
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        expense_name,
        amount,
        date,
        category,
        is_profit,
      });

      setExpenses([...expenses, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setEditValues(exp);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, editValues);
      setExpenses(
        expenses.map((e) => (e.id === id ? editValues : e))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => setEditingId(null);

  // ================= FILTER =================
  const filteredExpenses = expenses.filter((e) => {
    if (activeTable === "unprofitable") return e.is_profit === 0;
    return e.category === activeTable;
  });

  return (
    <div className="container mt-4">

      {/* ================= HEADER ================= */}
      <div className="card shadow mb-3 p-3 d-flex flex-row justify-content-between align-items-center">
        
        <h3 className="mb-0 text-capitalize">
          {activeTable} Expenses
        </h3>

        <div className="d-flex align-items-center">

          <button
            className="btn btn-outline-primary me-2"
            onClick={() => setActiveTable("bar")}
          >
            Bar Expenses
          </button>

          <button
            className="btn btn-outline-warning me-2"
            onClick={() => setActiveTable("kitchen")}
          >
            Kitchen Expenses
          </button>

          <button
            className="btn btn-outline-danger me-2"
            onClick={() => setActiveTable("unprofitable")}
          >
            Unprofitable Expenses
          </button>

          {/* NEW CREDITS BUTTON */}
          <button
            className="btn btn-dark me-2"
            onClick={() => navigate("/credits")}
          >
            Credits
          </button>

          <button className="btn btn-success" onClick={handleAdd}>
            + Add
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Profit?</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6">No records found</td>
                </tr>
              ) : (
                filteredExpenses.map((exp, i) => (
                  <tr key={exp.id}>
                    <td>{i + 1}</td>

                    {/* DATE */}
                    <td>
                      {editingId === exp.id ? (
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={editValues.date}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              date: e.target.value,
                            })
                          }
                        />
                      ) : (
                        exp.date
                      )}
                    </td>

                    {/* NAME */}
                    <td>
                      {editingId === exp.id ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editValues.expense_name}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              expense_name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        exp.expense_name
                      )}
                    </td>

                    {/* AMOUNT */}
                    <td>
                      {editingId === exp.id ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editValues.amount}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              amount: e.target.value,
                            })
                          }
                        />
                      ) : (
                        exp.amount
                      )}
                    </td>

                    {/* PROFIT STATUS */}
                    <td>
                      {exp.is_profit === 1 ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-danger">No</span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td>
                      {editingId === exp.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleSave(exp.id)}
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
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEditClick(exp)}
                        >
                          Update
                        </button>
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

export default Expenses;