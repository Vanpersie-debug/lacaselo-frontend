import React, { useEffect, useState } from "react";
import axios from "axios";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    expense_name: "",
    amount: "",
    date: "",
    is_profit: 0,
  });

  const API_URL = "http://localhost:5000/api/expenses";

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add new expense
  const handleAdd = async () => {
    const expense_name = prompt("Enter expense name:");
    const amount = Number(prompt("Enter amount:"));
    const date = prompt("Enter date (YYYY-MM-DD):");
    const is_profit = prompt("Is this profit-generating? (1 for yes, 0 for no):");

    if (!expense_name || isNaN(amount) || !date || (is_profit !== "1" && is_profit !== "0")) {
      alert("Please provide valid expense details.");
      return;
    }

    try {
      const res = await axios.post(API_URL, { expense_name, amount, date, is_profit });
      setExpenses([...expenses, res.data]);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  // Edit expense
  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setEditValues({
      expense_name: expense.expense_name,
      amount: expense.amount,
      date: expense.date,
      is_profit: expense.is_profit,
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, editValues);
      setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...editValues } : e)));
      setEditingId(null);
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  const handleCancel = () => setEditingId(null);

  return (
    <div className="container mt-4">
      <div className="card shadow mb-4">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <h2 className="mb-2 mb-md-0">Expenses</h2>
          <button className="btn btn-success w-100 w-md-auto" onClick={handleAdd}>
            + Add Expense
          </button>
        </div>
      </div>

      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Expense Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Profit?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="6">No expenses available</td>
                </tr>
              ) : (
                expenses.map((expense, index) => (
                  <tr key={expense.id}>
                    <td>{index + 1}</td>
                    <td>
                      {editingId === expense.id ? (
                        <input
                          type="text"
                          value={editValues.expense_name}
                          onChange={(e) =>
                            setEditValues({ ...editValues, expense_name: e.target.value })
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        expense.expense_name
                      )}
                    </td>
                    <td>
                      {editingId === expense.id ? (
                        <input
                          type="number"
                          value={editValues.amount}
                          onChange={(e) =>
                            setEditValues({ ...editValues, amount: e.target.value })
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        expense.amount
                      )}
                    </td>
                    <td>
                      {editingId === expense.id ? (
                        <input
                          type="date"
                          value={editValues.date}
                          onChange={(e) =>
                            setEditValues({ ...editValues, date: e.target.value })
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        expense.date
                      )}
                    </td>
                    <td>
                      {editingId === expense.id ? (
                        <select
                          value={editValues.is_profit}
                          onChange={(e) =>
                            setEditValues({ ...editValues, is_profit: e.target.value })
                          }
                          className="form-control form-control-sm"
                        >
                          <option value={1}>Yes</option>
                          <option value={0}>No</option>
                        </select>
                      ) : expense.is_profit === 1 ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>
                    <td>
                      {editingId === expense.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleSave(expense.id)}
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
                          onClick={() => handleEditClick(expense)}
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
