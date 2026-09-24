import { useEffect, useState } from "react";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(
        "FETCH MY ORDERS ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };


  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status delivered";

      case "Shipped":
        return "status shipped";

      case "Processing":
        return "status processing";

      case "Cancelled":
        return "status cancelled";

      default:
        return "status pending";
    }
  };


  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="orders-loading">
          Loading your orders...
        </div>
      </div>
    );
  }


  return (
    <div className="my-orders-page">

      <div className="orders-container">

        <div className="orders-header">
          <h1>My Orders</h1>

          <p>
            View and track all the orders
            you have placed.
          </p>
        </div>


        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}


        {!error && orders.length === 0 && (
          <div className="no-orders">

            <div className="no-orders-icon">
              🛒
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

          </div>
        )}


        {orders.length > 0 && (
          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}

                <div className="order-top">

                  <div>
                    <span className="order-label">
                      Order ID
                    </span>

                    <strong>
                      #{order._id}
                    </strong>
                  </div>


                  <div>
                    <span className="order-label">
                      Order Date
                    </span>

                    <strong>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </strong>
                  </div>


                  <div>
                    <span className="order-label">
                      Status
                    </span>

                    <span
                      className={getStatusClass(
                        order.status
                      )}
                    >
                      {order.status ||
                        "Pending"}
                    </span>
                  </div>

                </div>


                {/* PRODUCTS */}

                <div className="order-products">

                  <h3>Products</h3>

                  {order.products?.map(
                    (product, index) => (

                      <div
                        className="order-product"
                        key={
                          `${order._id}-${index}`
                        }
                      >

                        <div className="product-image">

                          {product.image &&
                          product.image.startsWith(
                            "http"
                          ) ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            <span>
                              {product.image ||
                                "📱"}
                            </span>
                          )}

                        </div>


                        <div className="product-info">

                          <h4>
                            {product.name}
                          </h4>

                          <p>
                            Quantity:{" "}
                            {product.quantity}
                          </p>

                          <p>
                            ₹
                            {Number(
                              product.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}{" "}
                            each
                          </p>

                        </div>


                        <div className="product-total">

                          ₹
                          {(
                            Number(
                              product.price || 0
                            ) *
                            Number(
                              product.quantity || 0
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>


                {/* ORDER BOTTOM */}

                <div className="order-bottom">

                  <div className="payment-info">

                    <span>
                      Payment Method
                    </span>

                    <strong>
                      {order.paymentMethod ||
                        "N/A"}
                    </strong>

                  </div>


                  <div className="order-total">

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>


                {/* CUSTOMER DETAILS */}

                <div className="customer-details">

                  <h3>
                    Delivery Details
                  </h3>

                  <p>
                    <strong>
                      {order.customer?.name}
                    </strong>
                  </p>

                  <p>
                    {order.customer?.phone}
                  </p>

                  <p>
                    {order.customer?.address},{" "}
                    {order.customer?.city} -{" "}
                    {order.customer?.pincode}
                  </p>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default MyOrders;
