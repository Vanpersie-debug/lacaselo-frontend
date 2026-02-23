import React, { useEffect, useState } from "react";
import axios from "axios";

function Bar() {
  const today = new Date().toISOString().split("T")[0];

  const [products, setProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://backend-vitq.onrender.com/api/drinks";

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async (date) => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { params: { date } });

      const prods = res.data.products || [];

      setProducts(prods);
      setTotalEarned(res.data.totalEarned || 0);

      const profitSum = prods.reduce(
        (sum, p) => sum + Number(p.profit || 0),
        0
      );

      const stockValue = prods.reduce(
        (sum, p) =>
          sum +
          Number(p.closing_stock || 0) *
            Number(p.initial_price || 0),
        0
      );

      const lowStock = prods.filter(
        (p) => Number(p.closing_stock) < 5
      ).length;

      setTotalProfit(profitSum);
      setTotalStockValue(stockValue);
      setLowStockCount(lowStock);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedDate);
  }, [selectedDate]);

  // ================= CHANGE DATE =================
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    const formatted = newDate.toISOString().split("T")[0];

    if (formatted > today) return;

    setSelectedDate(formatted);
  };

  // ================= ADD PRODUCT =================
  const handleAdd = async () => {
    const name = prompt("Product name:");
    if (!name) return alert("Name is required");

    const initial_price = Number(prompt("Cost price:")) || 0;
    const price = Number(prompt("Selling price:")) || 0;
    const opening_stock = Number(prompt("Opening stock:")) || 0;

    try {
      await axios.post(API_URL, {
        name,
        initial_price,
        price,
        opening_stock,
        date: selectedDate,
      });

      fetchProducts(selectedDate);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // ================= UPDATE ENTREE =================
  const handleEntreeChange = async (id, value) => {
    const entreeValue = Number(value);
    const product = products.find((p) => p.id === id);

    try {
      await axios.put(`${API_URL}/${id}`, {
        entree: entreeValue,
        sold: product.sold || 0,
        date: selectedDate,
      });

      fetchProducts(selectedDate);
    } catch (err) {
      console.error("Error updating entree:", err);
    }
  };

  // ================= UPDATE SOLD =================
  const handleSoldChange = async (id, value) => {
    const soldValue = Number(value);
    const product = products.find((p) => p.id === id);

    try {
      await axios.put(`${API_URL}/${id}`, {
        entree: product.entree || 0,
        sold: soldValue,
        date: selectedDate,
      });

      fetchProducts(selectedDate);
    } catch (err) {
      console.error("Error updating sold:", err);
    }
  };

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString();

  return (
    <div className="container-fluid mt-4">
      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <div className="card text-white shadow border-0" style={{ backgroundColor: "#0B3D2E" }}>
            <div className="card-body">
              <h6>Total Sales</h6>
              <h4>RWF {formatNumber(totalEarned)}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0" style={{ backgroundColor: "#D4AF37", color: "#000" }}>
            <div className="card-body">
              <h6>Total Profit</h6>
              <h4>RWF {formatNumber(totalProfit)}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white shadow border-0" style={{ backgroundColor: "#0E6251" }}>
            <div className="card-body">
              <h6>Total Stock Value</h6>
              <h4>RWF {formatNumber(totalStockValue)}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white shadow border-0" style={{ backgroundColor: "#C0392B" }}>
            <div className="card-body">
              <h6>Low Stock</h6>
              <h4>{lowStockCount}</h4>
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0">Bar</h4>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-dark btn-sm" onClick={() => changeDate(-1)}>◀</button>
            <strong>{selectedDate}</strong>
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={() => changeDate(1)}
              disabled={selectedDate === today}
            >▶</button>

            <button className="btn btn-success ms-3" onClick={handleAdd}>
              + Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow border-0">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Cost</th>
                <th>Selling</th>
                <th>Opening</th>
                <th>Stock In</th>
                <th>Total</th>
                <th>Sold</th>
                <th>Closing</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="10">No report for this date</td></tr>
              ) : (
                products.map((p, i) => {
                  const totalStock = p.total_stock;
                  const closing = p.closing_stock;
                  const totalSold = p.total_sold;

                  return (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td>{p.name}</td>
                      <td>{formatNumber(p.initial_price)}</td>
                      <td>{formatNumber(p.price)}</td>
                      <td>{p.opening_stock}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={p.entree}
                          onChange={(e) =>
                            handleEntreeChange(p.id, e.target.value)
                          }
                        />
                      </td>
                      <td>{totalStock}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={p.sold}
                          onChange={(e) =>
                            handleSoldChange(p.id, e.target.value)
                          }
                        />
                      </td>
                      <td>{closing}</td>
                      <td className="text-success fw-bold">
                        {formatNumber(totalSold)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Bar;