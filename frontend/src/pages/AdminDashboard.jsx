
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Smartphones",
    price: "",
    rating: "",
    stock: "",
    description: "",
    image: "📱",
  });

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://techkart-backend1.onrender.com/api/products"
      );

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setLoading(false);
    }
  };

  // =========================
  // FETCH ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://techkart-backend1.onrender.com/api/orders"
      );

      const data = await response.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // =========================
  // FORM INPUT
  // =========================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Smartphones",
      price: "",
      rating: "",
      stock: "",
      description: "",
      image: "📱",
    });

    setEditingProduct(null);
    setShowForm(false);
  };

  // =========================
  // ADD / UPDATE PRODUCT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
      stock: Number(formData.stock),
    };

    try {
      let response;

      if (editingProduct) {
        response = await fetch(
          'https://techkart-backend1.onrender.com/api/products/${editingProduct._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );
      } else {
        response = await fetch(
          "https://techkart-backend1.onrender.com/api/products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Request failed");
      }

      alert(
        editingProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      category: product.category || "Smartphones",
      price: product.price || "",
      rating: product.rating || "",
      stock: product.stock || "",
      description: product.description || "",
      image: product.image || "📱",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://techkart-backend1.onrender.com/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Product deleted successfully!");

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================

const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(
      `https://techkart-backend1.onrender.com/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );

    const data = await response.json();

    console.log("Status response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update order status"
      );
    }

    alert("Order status updated successfully!");

    await fetchOrders();
  } catch (error) {
    console.error("Status update error:", error);

    alert(
      `Failed to update order status.\n\n${error.message}`
    );
  }
};
  // =========================
  // DELETE ORDER
  // =========================

 const deleteOrder = async (orderId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(
      `https://techkart-backend1.onrender.com/api/orders/${orderId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    console.log("Delete response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete order"
      );
    }

    alert("Order deleted successfully!");

    await fetchOrders();
  } catch (error) {
    console.error("Delete order error:", error);

    alert(
      `Failed to delete order.\n\n${error.message}`
    );
  }
};

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <p className="admin-loading">
        Loading dashboard...
      </p>
    );
  }

  // =========================
  // PRODUCT ANALYTICS
  // =========================

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  );

  const averageRating =
    products.length > 0
      ? (
          products.reduce(
            (sum, product) =>
              sum + Number(product.rating || 0),
            0
          ) / products.length
        ).toFixed(1)
      : "0.0";

  const categories = [
    ...new Set(
      products.map(
        (product) => product.category
      )
    ),
  ];

  // =========================
  // ORDER ANALYTICS
  // =========================

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  // =========================
  // CATEGORY ANALYTICS
  // =========================

  const categoryCounts = categories.map(
    (category) =>
      products.filter(
        (product) =>
          product.category === category
      ).length
  );

  const categoryStock = categories.map(
    (category) =>
      products
        .filter(
          (product) =>
            product.category === category
        )
        .reduce(
          (sum, product) =>
            sum + Number(product.stock || 0),
          0
        )
  );

  // =========================
  // PRODUCT CHART
  // =========================

  const productChartData = {
    labels: categories,
    datasets: [
      {
        label: "Number of Products",
        data: categoryCounts,
      },
    ],
  };

  // =========================
  // STOCK CHART
  // =========================

  const stockChartData = {
    labels: categories,
    datasets: [
      {
        label: "Available Stock",
        data: categoryStock,
      },
    ],
  };

  return (
    <div className="admin-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Manage products and monitor
            TechKart analytics.
          </p>
        </div>
      </section>

      {/* =========================
          STATISTICS
      ========================= */}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            📦
          </div>

          <div>
            <p>Total Products</p>
            <h2>{totalProducts}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            📊
          </div>

          <div>
            <p>Total Stock</p>
            <h2>{totalStock}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            🛍️
          </div>

          <div>
            <p>Total Orders</p>
            <h2>{totalOrders}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            💰
          </div>

          <div>
            <p>Total Revenue</p>

            <h2>
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            ⏳
          </div>

          <div>
            <p>Pending Orders</p>
            <h2>{pendingOrders}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            ✅
          </div>

          <div>
            <p>Delivered Orders</p>
            <h2>{deliveredOrders}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            ⭐
          </div>

          <div>
            <p>Average Rating</p>
            <h2>{averageRating}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            🏷️
          </div>

          <div>
            <p>Categories</p>
            <h2>{categories.length}</h2>
          </div>
        </div>

      </section>

      {/* =========================
          CHARTS
      ========================= */}

      <section className="admin-charts">

        <div className="chart-card">
          <h2>Products by Category</h2>

          <Bar
            data={productChartData}
            options={{
              responsive: true,

              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

        <div className="chart-card">
          <h2>Stock by Category</h2>

          <Bar
            data={stockChartData}
            options={{
              responsive: true,

              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

      </section>

      {/* =========================
          PRODUCT FORM
      ========================= */}

      {showForm && (
        <section className="admin-form-section">

          <div className="admin-form-header">

            <h2>
              {editingProduct
                ? "Edit Product"
                : "Add New Product"}
            </h2>

            <button
              className="close-form-btn"
              onClick={resetForm}
            >
              ✕
            </button>

          </div>

          <form
            className="admin-product-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option>Smartphones</option>
                <option>Laptops</option>
                <option>Audio</option>
                <option>Smartwatches</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="form-group">
              <label>Rating</label>

              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="Example: 4.5"
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Enter stock"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Image / Icon</label>

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Example: 📱"
              />
            </div>

            <div className="form-group form-full">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="4"
                required
              />
            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="save-product-btn"
              >
                {editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>

              <button
                type="button"
                className="cancel-product-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

          </form>
        </section>
      )}

      {/* =========================
          PRODUCT MANAGEMENT
      ========================= */}

      <section className="admin-products">

        <div className="admin-products-header">

          <h2>Product Management</h2>

          <button
            className="add-product-btn"
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
          >
            + Add Product
          </button>

        </div>

        <div className="admin-table-container">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.map((product) => (

                <tr key={product._id}>

                  <td>
                    <span className="admin-product-image">

                      {product.image?.startsWith(
                        "http"
                      ) ? (
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        product.image || "📦"
                      )}

                    </span>

                    {product.name}
                  </td>

                  <td>
                    {product.category}
                  </td>

                  <td>
                    ₹
                    {Number(
                      product.price || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    ⭐ {product.rating || 0}
                  </td>

                  <td>
                    {product.stock || 0}
                  </td>

                  <td>

                    <div className="admin-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* =========================
          ORDER MANAGEMENT
      ========================= */}

      <section className="admin-orders">

        <div className="admin-products-header">

          <h2>Order Management</h2>

          <span className="order-count">
            {orders.length} Orders
          </span>

        </div>

        {orders.length === 0 ? (

          <div className="no-orders">

            <div>🛍️</div>

            <h3>No Orders Yet</h3>

            <p>
              Orders placed by customers
              will appear here.
            </p>

          </div>

        ) : (

          <div className="orders-table-container">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order._id}>

                    <td>
                      #
                      {order._id
                        .slice(-6)
                        .toUpperCase()}
                    </td>

                    <td>

                      <strong>
                        {order.customer?.name ||
                          "N/A"}
                      </strong>

                      <br />

                      <small>
                        {order.customer?.email ||
                          "N/A"}
                      </small>

                    </td>

                    {/* FIX:
                        order.items → order.products
                    */}

                    <td>
                      {(order.products || []).reduce(
                        (sum, item) =>
                          sum +
                          Number(
                            item.quantity || 0
                          ),
                        0
                      )}
                    </td>

                    <td>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {order.paymentMethod
                        ? order.paymentMethod.toUpperCase()
                        : "N/A"}
                    </td>

                    <td>

                      <select
                        className={`order-status ${
                          (
                            order.status ||
                            "Pending"
                          ).toLowerCase()
                        }`}
                        value={
                          order.status ||
                          "Pending"
                        }
                        onChange={(event) =>
                          updateOrderStatus(
                            order._id,
                            event.target.value
                          )
                        }
                      >

                        <option>
                          Pending
                        </option>

                        <option>
                          Processing
                        </option>

                        <option>
                          Shipped
                        </option>

                        <option>
                          Delivered
                        </option>

                        <option>
                          Cancelled
                        </option>

                      </select>

                    </td>

                    <td>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"}
                    </td>
    <td>
      <div className="admin-actions">

        <button
          className="view-order-btn"
          onClick={() =>
            setSelectedOrder(order)
          }
        >
          View
        </button>

        <button
          className="delete-btn"
          onClick={() =>
            deleteOrder(order._id)
          }
        >
          Delete
        </button>

      </div>
    </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

       {selectedOrder && (
      <div className="order-modal-overlay">

        <div className="order-modal">

          <div className="order-modal-header">

            <div>
              <h2>Order Details</h2>

              <p>
                #
                {selectedOrder._id
                  .slice(-6)
                  .toUpperCase()}
              </p>
            </div>

            <button
              className="order-modal-close"
              onClick={() =>
                setSelectedOrder(null)
              }
            >
              ✕
            </button>

          </div>

          <div className="order-customer-details">

            <h3>Customer Information</h3>

            <p>
              <strong>Name:</strong>{" "}
              {selectedOrder.customer?.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {selectedOrder.customer?.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selectedOrder.customer?.phone}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {selectedOrder.customer?.address}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {selectedOrder.customer?.city}
            </p>

            <p>
              <strong>Pincode:</strong>{" "}
              {selectedOrder.customer?.pincode}
            </p>

          </div>

          <div className="order-products-details">

            <h3>Products</h3>

            {(selectedOrder.products || []).map(
              (item, index) => (
                <div
                  className="order-detail-product"
                  key={index}
                >

                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <p>
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString("en-IN")}
                      {" × "}
                      {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>
              )
            )}

          </div>

          <div className="order-detail-summary">

            <p>
              <span>Payment</span>

              <strong>
                {selectedOrder.paymentMethod?.toUpperCase()}
              </strong>
            </p>

            <p>
              <span>Status</span>

              <strong>
                {selectedOrder.status || "Pending"}
              </strong>
            </p>

            <p className="order-grand-total">
              <span>Total</span>

              <strong>
                ₹
                {Number(
                  selectedOrder.totalAmount || 0
                ).toLocaleString("en-IN")}
              </strong>
            </p>

          </div>

        </div>

      </div>
    )}

  </div>
  );
}

export default AdminDashboard;
