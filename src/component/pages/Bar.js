import React, { useEffect, useState } from "react";
import axios from "axios";

function Bar() {
  const today = new Date().toISOString().split("T")[0];

  const [products, setProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://backend-vitq.onrender.com/api/drinks";

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async (date) => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { params: { date } });

      setProducts(res.data.products || []);
      setTotalEarned(res.data.totalEarned || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedDate);
  }, [selectedDate]);

  // ================= ADD PRODUCT =================
  const handleAdd = async () => {
    const name = prompt("Product name:");
    if (!name) return;

    const initial_price = Number(prompt("Cost price:")) || 0;
    const price = Number(prompt("Selling price:")) || 0;
    const opening_stock = Number(prompt("Opening stock:")) || 0;

    await axios.post(API_URL, {
      name,
      initial_price,
      price,
      opening_stock,
      date: selectedDate,
    });

    fetchProducts(selectedDate);
  };

  // ================= LOCAL INPUT CHANGE =================
  const handleLocalChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  // ================= SAVE STOCK =================
  const saveStock = async (product) => {
    try {
      await axios.put(`${API_URL}/stock/${product.id}`, {
        entree: Number(product.entree) || 0,
        sold: Number(product.sold) || 0,
        date: selectedDate,
      });

      fetchProducts(selectedDate);
    } catch (err) {
      console.error(err);
    }
  };

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString();

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Bar - {selectedDate}</h4>

      <button className="btn btn-success mb-3" onClick={handleAdd}>
        + Add Product
      </button>

      <h5>Total Sales: RWF {formatNumber(totalEarned)}</h5>

      <div className="table-responsive mt-3">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
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
              <tr><td colSpan="10">No data</td></tr>
            ) : (
              products.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>{formatNumber(p.initial_price)}</td>
                  <td>{formatNumber(p.price)}</td>
                  <td>{p.opening_stock}</td>

                  <td>
                    <input
                      type="number"
                      value={p.entree || ""}
                      className="form-control"
                      onChange={(e) =>
                        handleLocalChange(p.id, "entree", e.target.value)
                      }
                      onBlur={() => saveStock(p)}
                    />
                  </td>

                  <td>{p.total_stock}</td>

                  <td>
                    <input
                      type="number"
                      value={p.sold || ""}
                      className="form-control"
                      onChange={(e) =>
                        handleLocalChange(p.id, "sold", e.target.value)
                      }
                      onBlur={() => saveStock(p)}
                    />
                  </td>

                  <td>{p.closing_stock}</td>
                  <td>{formatNumber(p.total_sold)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bar;