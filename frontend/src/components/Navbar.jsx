import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const count = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">TechKart</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart" className="cart-link">
          Cart

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </Link>

        <Link to="/admin">
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;