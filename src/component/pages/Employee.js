import React, { useEffect, useState } from "react";
import axios from "axios";

function Employee() {
  const [employees, setEmployees] = useState([]);

  // LOAD employees
  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ADD EMPLOYEE
  const handleAdd = async () => {
    const name = prompt("Employee Name:");
    const loan = prompt("Loan Amount:");
    const monthlyPayment = prompt("Monthly Payment:");

    if (name && loan && monthlyPayment) {
      await axios.post("http://localhost:5000/api/employees", {
        name,
        loan: Number(loan),
        monthlyPayment: Number(monthlyPayment),
      });
      fetchEmployees();
    }
  };

  // UPDATE EMPLOYEE
  const handleUpdate = async (id) => {
    const loan = prompt("New Loan Amount:");
    const monthlyPayment = prompt("New Monthly Payment:");

    if (loan && monthlyPayment) {
      await axios.put(
        `http://localhost:5000/api/employees/update/${id}`,
        {
          loan: Number(loan),
          monthlyPayment: Number(monthlyPayment),
        }
      );
      fetchEmployees();
    }
  };

  // PAY LOAN
  const handlePayLoan = async (id) => {
    const payment = prompt("Payment Amount:");
    if (payment) {
      await axios.put(
        `http://localhost:5000/api/employees/pay/${id}`,
        { payment: Number(payment) }
      );
      fetchEmployees();
    }
  };

  // DELETE EMPLOYEE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await axios.delete(
        `http://localhost:5000/api/employees/${id}`
      );
      fetchEmployees();
    }
  };

  return (
    <div className="container mt-4">

      <div className="card shadow mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Employee</h2>
          <button className="btn btn-success" onClick={handleAdd}>
            + Add Employee
          </button>
        </div>
      </div>

      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Loan (RWF)</th>
                <th>Monthly Payment</th>
                <th>Remaining</th>
                <th>Loan Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="8">No employees found</td>
                </tr>
              ) : (
                employees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{index + 1}</td>
                    <td>{emp.name}</td>
                    <td>{emp.loan}</td>
                    <td>{emp.monthlyPayment}</td>
                    <td>{emp.remaining}</td>
                    <td>{emp.loanDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          emp.status === "Paid"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleUpdate(emp.id)}
                      >
                        Update
                      </button>

                      {emp.status !== "Paid" && (
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handlePayLoan(emp.id)}
                        >
                          Pay Loan
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
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

export default Employee;
