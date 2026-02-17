import React, { useEffect, useState } from "react";
import axios from "axios";

function Bar() {
  const today = new Date().toISOString().split("T")[0];

  const [products, setProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [totalEarned, setTotalEarned] = useState(0);

  const API_URL = "https://backend-vitq.onrender.com/api/drinks";

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async (date) => {
    try {
      const res = await axios.get(API_URL, { params: { date } });
      // res.data = { products: [...], totalEarned: 7500 }
      setProducts(res.data.products || []);       // ensure it's always an array
      setTotalEarned(res.data.totalEarned || 0);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setTotalEarned(0);
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
    const price = prompt("Price:");
    const quantity = prompt("Opening stock:");

    if (!name || !price || !quantity) return;

    try {
      await axios.post(API_URL, {
        name,
        price: Number(price),
        quantity: Number(quantity),
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

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, entree: entreeValue } : p))
    );

    try {
      await axios.put(`${API_URL}/entree/${id}`, {
        entree: entreeValue,
        date: selectedDate,
      });
      fetchProducts(selectedDate); // refresh totalEarned
    } catch (err) {
      console.error("Error updating entree:", err);
    }
  };

  // ================= UPDATE SOLD =================
  const handleSoldChange = async (id, value) => {
    const soldValue = Number(value);

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, sold: soldValue } : p))
    );

    try {
      await axios.put(`${API_URL}/sold/${id}`, {
        sold: soldValue,
        date: selectedDate,
      });
      fetchProducts(selectedDate); // refresh totalEarned
    } catch (err) {
      console.error("Error updating sold:", err);
    }
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="card shadow mb-4 p-3 d-flex justify-content-between align-items-center">
        <h2>Bar</h2>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => changeDate(-1)}
          >
            ◀
          </button>

          <strong>{selectedDate}</strong>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => changeDate(1)}
            disabled={selectedDate === today}
          >
            ▶
          </button>

          <button
            className="btn btn-success ms-3"
            onClick={handleAdd}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Price (RWF)</th>
                <th>Opening Stock</th>
                <th>Entree</th>
                <th>Total Stock</th>
                <th>Sold</th>
                <th>Total Sold (RWF)</th>
                <th>Closing Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="9">No products for this date</td>
                </tr>
              ) : (
                products.map((product, index) => {
                  const openingStock = Number(product.quantity);
                  const entree = Number(product.entree || 0);
                  const sold = Number(product.sold || 0);
                  const price = Number(product.price);

                  const totalStock = openingStock + entree;
                  const totalSold = sold * price;
                  const closingStock = totalStock - sold;

                  return (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{price}</td>
                      <td>{openingStock}</td>

                      {/* ENTREE INPUT */}
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={entree}
                          onChange={(e) =>
                            handleEntreeChange(product.id, e.target.value)
                          }
                        />
                      </td>

                      {/* TOTAL STOCK */}
                      <td>{totalStock}</td>

                      {/* SOLD INPUT */}
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={sold}
                          onChange={(e) =>
                            handleSoldChange(product.id, e.target.value)
                          }
                        />
                      </td>

                      {/* TOTAL SOLD */}
                      <td>{totalSold}</td>

                      {/* CLOSING STOCK */}
                      <td>{closingStock}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOTAL EARNED */}
      <div className="mt-2 text-end fw-bold fs-5">
        Total Earned (RWF): {totalEarned}
      </div>
    </div>
  );
}

export default Bar;