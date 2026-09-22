
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    navigate("/products");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          products: cart,
          paymentMethod: paymentMethod,
          totalAmount: total,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to place order"
      );
    }

    console.log("Order saved:", data.order);

    alert(
      `Order placed successfully!\n\nThank you ${formData.name}.`
    );

    localStorage.removeItem("cart");

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    navigate("/products");
  } catch (error) {
    console.error("Order error:", error);

    alert(
      "Failed to place order.\nPlease try again."
    );
  }
};

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="continue-shopping-btn"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* Header */}
      <section className="checkout-header">
        <h1>Checkout</h1>

        <p>
          Complete your details and choose your payment method.
        </p>
      </section>

      <div className="checkout-container">

        {/* LEFT SIDE */}
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          {/* Customer Information */}
          <div className="checkout-card">

            <h2>Customer Information</h2>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>

            </div>

          </div>

          {/* Delivery Address */}
          <div className="checkout-card">

            <h2>Delivery Address</h2>

            <div className="form-group">

              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House No., Street, Area"
                rows="4"
                required
              ></textarea>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />

              </div>

              <div className="form-group">

                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  required
                />

              </div>

            </div>

          </div>

          {/* Payment Method */}
          <div className="checkout-card">

            <h2>Payment Method</h2>

            <div className="payment-options">

              <label
                className={`payment-option ${
                  paymentMethod === "cod"
                    ? "payment-selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div>
                  <strong>Cash on Delivery</strong>

                  <p>
                    Pay when your order arrives
                  </p>
                </div>

              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "upi"
                    ? "payment-selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div>
                  <strong>UPI</strong>

                  <p>
                    Pay using UPI apps
                  </p>
                </div>

              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "card"
                    ? "payment-selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div>
                  <strong>Credit / Debit Card</strong>

                  <p>
                    Secure card payment
                  </p>
                </div>

              </label>

            </div>

          </div>

          {/* Actions */}
          <div className="checkout-actions">

            <Link
              to="/cart"
              className="back-cart-btn"
            >
              ← Back to Cart
            </Link>

            <button
              type="submit"
              className="place-order-btn"
            >
              Place Order
            </button>

          </div>

        </form>

        {/* RIGHT SIDE */}
        <div className="checkout-summary">

          <h2>Order Summary</h2>

          <div className="checkout-products">

            {cart.map((item) => (

              <div
                className="checkout-product"
                key={item.id}
              >

                <div className="checkout-product-image">

                  {item.image &&
                  item.image.startsWith("http") ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span>
                      {item.image || "📦"}
                    </span>
                  )}

                </div>

                <div className="checkout-product-info">

                  <h3>{item.name}</h3>

                  <p>
                    Quantity: {item.quantity}
                  </p>

                  <strong>
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>

            ))}

          </div>

          <div className="checkout-summary-row">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="checkout-summary-row">
            <span>Delivery</span>

            <span className="free-delivery">
              FREE
            </span>
          </div>

          <div className="checkout-summary-row">
            <span>Payment</span>

            <span>
              {paymentMethod === "cod"
                ? "COD"
                : paymentMethod === "upi"
                ? "UPI"
                : "Card"}
            </span>
          </div>

          <div className="summary-divider"></div>

          <div className="checkout-total">

            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;
