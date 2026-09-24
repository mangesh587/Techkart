import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const updateCartCount = () => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const count = cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

    setCartCount(count);
  };

  const updateUser = () => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "Invalid user data:",
          error
        );

        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateCartCount();
    updateUser();

    window.addEventListener(
      "storage",
      updateCartCount
    );

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    window.addEventListener(
      "authUpdated",
      updateUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateCartCount
      );

      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

      window.removeEventListener(
        "authUpdated",
        updateUser
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.dispatchEvent(
      new Event("authUpdated")
    );

    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}

      <div className="navbar-logo">
        <Link to="/">
          TechKart
        </Link>
      </div>


      {/* NAVIGATION */}

      <div className="navbar-links">

        <Link to="/">
          Home 🏠 
        </Link>

        <Link to="/products">
          Products
        </Link>


        {/* CART */}

        <Link
          to="/cart"
          className="cart-link"
        >
          Cart 🛒 

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </Link>


        {/* MY ORDERS */}

        {user && user.role !== "admin" && (
          <Link to="/my-orders">
            My Orders 🥡
          </Link>
        )}


        {/* ADMIN */}

        {user?.role === "admin" && (
          <Link to="/admin">
            Admin Panel
          </Link>
        )}


        {/* AUTH */}

        {user ? (
          <div className="navbar-user">

            <span className="navbar-user-name">
              Hi, {user.name}
            </span>

            <button
              className="navbar-logout-btn"
              onClick={handleLogout}
            >
              Logout 
            </button>

          </div>
        ) : (
          <Link
            to="/login"
            className="navbar-login-btn"
          >
            Login
          </Link>
        )}

      </div>

    </nav>
  );
}

export default Navbar;
