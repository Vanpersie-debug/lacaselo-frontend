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

  // ================= UPDATE STOCK =================
  const handleEntreeChange = async (id, value) => {
    const product = products.find((p) => p.id === id);

    await axios.put(`${API_URL}/stock/${id}`, {
      entree: value,
      sold: product.sold,
      date: selectedDate,
    });

    fetchProducts(selectedDate);
  };

  const handleSoldChange = async (id, value) => {
    const product = products.find((p) => p.id === id);

    await axios.put(`${API_URL}/stock/${id}`, {
      entree: product.entree,
      sold: value,
      date: selectedDate,
    });

    fetchProducts(selectedDate);
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
                  const isLow = Number(p.closing_stock) < 5;
                  const isOut = Number(p.closing_stock) === 0;

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

                      <td>{p.total_stock}</td>

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

                      <td>
                        {p.closing_stock}

                        {isOut && (
                          <span
                            className="ms-2 px-2"
                            style={{
                              backgroundColor: "black",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            OUT
                          </span>
                        )}

                        {isLow && !isOut && (
                          <span
                            className="ms-2 px-2"
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            LOW
                          </span>
                        )}
                      </td>

                      <td className="text-success fw-bold">
                        {formatNumber(p.total_sold)}
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