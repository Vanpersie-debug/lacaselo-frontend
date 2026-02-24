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
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedDate);
  }, [selectedDate]);

  // ================= UPDATE STOCK =================
  const updateStock = async (id, entree, sold) => {
    try {
      await axios.put(`${API_URL}/stock/${id}`, {
        entree,
        sold,
        date: selectedDate,
      });

      fetchProducts(selectedDate);
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  // ================= UPDATE PRICE =================
  const updatePrice = async (product) => {
    const newCost = Number(
      prompt("Enter new cost price:", product.initial_price)
    );
    if (isNaN(newCost)) return alert("Invalid cost price");

    const newSelling = Number(
      prompt("Enter new selling price:", product.price)
    );
    if (isNaN(newSelling)) return alert("Invalid selling price");

    try {
      await axios.put(`${API_URL}/price/${product.id}`, {
        initial_price: newCost,
        price: newSelling,
        date: selectedDate,
      });

      fetchProducts(selectedDate);
    } catch (err) {
      console.error("Error updating price:", err);
    }
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Bar Report - {selectedDate}</h3>
        <h5>Total Sales: RWF {totalEarned.toLocaleString()}</h5>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Cost</th>
              <th>Selling</th>
              <th>Opening</th>
              <th>Entree</th>
              <th>Sold</th>
              <th>Closing</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10">Loading...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="10">No products for this date</td>
              </tr>
            ) : (
              products.map((p, i) => {
                const isLow = Number(p.closing_stock) < 5;
                const isOut = Number(p.closing_stock) === 0;

                return (
                  <tr
                    key={p.id}
                    className={isLow ? "table-danger" : ""}
                  >
                    <td>{i + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.initial_price}</td>
                    <td>{p.price}</td>
                    <td>{p.opening_stock}</td>

                    {/* ENTREE */}
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        defaultValue={p.entree}
                        onBlur={(e) =>
                          updateStock(
                            p.id,
                            e.target.value,
                            p.sold
                          )
                        }
                      />
                    </td>

                    {/* SOLD */}
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        defaultValue={p.sold}
                        disabled={isOut}
                        onBlur={(e) =>
                          updateStock(
                            p.id,
                            p.entree,
                            e.target.value
                          )
                        }
                      />
                    </td>

                    {/* CLOSING STOCK */}
                    <td>
                      {p.closing_stock}

                      {isOut && (
                        <span className="badge bg-dark ms-2">
                          OUT
                        </span>
                      )}

                      {isLow && !isOut && (
                        <span className="badge bg-danger ms-2">
                          LOW
                        </span>
                      )}
                    </td>

                    {/* SALES */}
                    <td className="fw-bold text-success">
                      {p.total_sold}
                    </td>

                    {/* EDIT PRICE */}
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => updatePrice(p)}
                      >
                        Edit
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bar;