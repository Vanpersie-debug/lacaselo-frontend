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

  const fetchProducts = async (date) => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { params: { date } });

      const prods = res.data.products || [];

      setProducts(prods);
      setTotalEarned(res.data.totalEarned || 0);

      // calculate totals
      const profitSum = prods.reduce(
        (sum, p) => sum + (Number(p.profit) || 0),
        0
      );

      const stockValue = prods.reduce(
        (sum, p) =>
          sum +
          (Number(p.closing_stock) || 0) *
            (Number(p.initial_price) || 0),
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

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    const formatted = newDate.toISOString().split("T")[0];
    if (formatted > today) return;
    setSelectedDate(formatted);
  };

  const handleAdd = async () => {
    const name = prompt("Product name:");
    if (!name) return alert("Name is required");

    const initial_price = Number(prompt("Cost (Initial price):")) || 0;
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

  const handleEntreeChange = async (id, value) => {
    const entreeValue = Number(value);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, entree: entreeValue } : p))
    );
    try {
      await axios.put(`${API_URL}/${id}`, {
        entree: entreeValue,
        date: selectedDate,
      });
      fetchProducts(selectedDate);
    } catch (err) {
      console.error("Error updating entree:", err);
    }
  };

  const handleSoldChange = async (id, value) => {
    const soldValue = Number(value);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, sold: soldValue } : p))
    );
    try {
      await axios.put(`${API_URL}/${id}`, {
        sold: soldValue,
        date: selectedDate,
      });
      fetchProducts(selectedDate);
    } catch (err) {
      console.error("Error updating sold:", err);
    }
  };

  const formatNumber = (value) => Number(value || 0).toLocaleString();

  return (
    <div className="container-fluid mt-4">

      {/* ===== SUMMARY CARDS ===== */}
      <div className="row g-4 mb-4">
        {/* Total Sales */}
        <div className="col-md-3">
          <div className="card text-white shadow border-0" style={{ backgroundColor: "#0B3D2E" }}>
            <div className="card-body">
              <h6>Total Sales</h6>
              <h4>RWF {formatNumber(totalEarned)}</h4>
            </div>
          </div>
        </div>

        {/* Total Profit */}
        <div className="col-md-3">
          <div className="card shadow border-0" style={{ backgroundColor: "#D4AF37", color: "#000" }}>
            <div className="card-body">
              <h6>Total Profit</h6>
              <h4>RWF {formatNumber(totalProfit)}</h4>
            </div>
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="col-md-3">
          <div className="card text-white shadow border-0" style={{ backgroundColor: "#0E6251" }}>
            <div className="card-body">
              <h6>Total Stock Value</h6>
              <h4>RWF {formatNumber(totalStockValue)}</h4>
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="col-md-3">
          <div className="card text-white shadow border-0" style={{ backgroundColor: "#C0392B" }}>
            <div className="card-body">
              <h6>Low Stock Items</h6>
              <h4>{lowStockCount}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* ===== HEADER ===== */}
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

            <button className="btn btn-success ms-3" onClick={handleAdd}>+ Add Product</button>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
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
                <th>Momo</th>
                <th>Cash</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="12">No report entered yet for this date</td>
                </tr>
              ) : (
                products.map((p, i) => {
                  const totalStock = (Number(p.opening_stock) || 0) + (Number(p.entree) || 0);
                  const totalSold = (Number(p.sold) || 0) * (Number(p.price) || 0);
                  const profit = (Number(p.sold) || 0) * ((Number(p.price) || 0) - (Number(p.initial_price) || 0));
                  const closing = totalStock - (Number(p.sold) || 0);
                  const isLow = closing < 5;

                  return (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td>
                        {p.name} {isLow && <span className="badge bg-danger ms-2">Low</span>}
                      </td>
                      <td>{formatNumber(p.initial_price)}</td>
                      <td>{formatNumber(p.price)}</td>
                      <td>{p.opening_stock}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={p.entree}
                          onChange={(e) => handleEntreeChange(p.id, e.target.value)}
                        />
                      </td>
                      <td>{totalStock}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={p.sold}
                          onChange={(e) => handleSoldChange(p.id, e.target.value)}
                        />
                      </td>
                      <td>{closing}</td>
                      <td className="text-success fw-bold">{formatNumber(totalSold)}</td>
                      <td className="text-success fw-bold">{formatNumber(Math.floor(totalSold / 2))}</td>
                      <td className="text-success fw-bold">{formatNumber(Math.ceil(totalSold / 2))}</td>
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