
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Update quantity
  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + change,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Update Navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Remove individual product
  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Update Navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");

    // Update Navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate total items
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="cart-page">

      {/* Cart Header */}
      <section className="cart-header">
        <div>
          <h1>Shopping Cart</h1>
          <p>
            Review your selected products before checkout.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </section>

      {/* Empty Cart */}
      {cart.length === 0 ? (
        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything to your
            cart yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping-btn"
          >
            Continue Shopping
          </Link>

        </div>
      ) : (

        /* Cart With Products */
        <section className="cart-container">

          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* Product Image */}
                <div className="cart-item-image">

                  {item.image &&
                  item.image.startsWith("http") ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span className="cart-placeholder">
                      {item.image || "📦"}
                    </span>
                  )}

                </div>

                {/* Product Information */}
                <div className="cart-item-info">

                  <span className="cart-category">
                    {item.category}
                  </span>

                  <h2>{item.name}</h2>

                  <h3>
                    ₹
                    {item.price.toLocaleString(
                      "en-IN"
                    )}
                  </h3>

                  {/* Quantity */}
                  <div className="cart-quantity">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          -1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* Remove */}
                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

                {/* Item Total */}
                <div className="cart-item-total">
                  ₹
                  {(
                    item.price *
                    item.quantity
                  ).toLocaleString("en-IN")}
                </div>

              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="continue-shopping-link"
            >
              ← Continue Shopping
            </Link>

          </div>

          {/* Order Summary */}
          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>

              <span>
                {totalItems}
              </span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <span className="free-delivery">
                FREE
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total</span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-btn"
            >
              Proceed to Checkout
            </Link>

          </div>

        </section>
      )}
    </div>
  );
}

export default Cart;

