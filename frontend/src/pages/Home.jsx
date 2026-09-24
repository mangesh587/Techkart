import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://techkart-backend1.onrender.com/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const featuredProducts = [...products]
    .sort(
      (a, b) =>
        Number(b.rating || 0) - Number(a.rating || 0)
    )
    .slice(0, 3);

  const isImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return false;
    }

    return (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("/")
    );
  };

  return (
    <div>
      {/* HERO SECTION */}

      <section className="hero">
        <div className="hero-content">
          <p className="hero-small">
            WELCOME TO TECHKART
          </p>

          <h1>
            Smart Technology.
            <br />
            Better Choices.
          </h1>

          <p>
            Discover the latest smartphones, laptops,
            headphones, smartwatches and electronics at
            great prices.
          </p>

          <Link to="/products" className="shop-btn">
            Shop Now →
          </Link>
        </div>

       <div className="hero-image">
  <img
    src="/Images/IMG_20260924_162501.png"
    alt="TechKart Electronics"
  />
</div>
      </section>

      {/* CATEGORY SECTION */}

      <section className="section">
        <h2>Shop by Category</h2>

        <p className="section-subtitle">
          Explore our popular electronics categories
        </p>

        <div className="category-container">
          <Link
            to="/products?category=Smartphones"
            className="category-card"
          >
            <div className="category-icon">
              📱
            </div>

            <h3>Smartphones</h3>

            <p>Latest mobile phones</p>
          </Link>

          <Link
            to="/products?category=Laptops"
            className="category-card"
          >
            <div className="category-icon">
              💻
            </div>

            <h3>Laptops</h3>

            <p>Powerful laptops</p>
          </Link>

          <Link
            to="/products?category=Audio"
            className="category-card"
          >
            <div className="category-icon">
              🎧
            </div>

            <h3>Audio</h3>

            <p>Headphones & earbuds</p>
          </Link>

          <Link
            to="/products?category=Smartwatches"
            className="category-card"
          >
            <div className="category-icon">
              ⌚
            </div>

            <h3>Smartwatches</h3>

            <p>Smart wearable tech</p>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}

      <section className="section products-section">
        <h2>Featured Products</h2>

        <p className="section-subtitle">
          Popular products you may like
        </p>

        {loading ? (
          <p className="no-products">
            Loading products...
          </p>
        ) : featuredProducts.length === 0 ? (
          <p className="no-products">
            No products available.
          </p>
        ) : (
          <div className="product-container">
            {featuredProducts.map((product) => (
              <div
                className="product-card"
                key={product._id}
              >
                {/* PRODUCT IMAGE */}

                <div className="product-image">
                  {isImageUrl(product.image) ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <span className="product-placeholder">
                      {product.image || "📦"}
                    </span>
                  )}
                </div>

                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <p>
                  ⭐ {Number(product.rating || 0).toFixed(1)}
                </p>

                <h3>
                  ₹
                  {Number(
                    product.price || 0
                  ).toLocaleString("en-IN")}
                </h3>

                <Link
                  to={`/product/${product._id}`}
                  className="view-product-btn"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="featured-more">
          <Link
            to="/products"
            className="view-all-btn"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* WHY TECHKART */}

      <section className="why-section">
        <h2>Why Choose TechKart?</h2>

        <div className="why-container">
          <div>
            <h3>🚚 Fast Delivery</h3>

            <p>
              Quick and reliable delivery.
            </p>
          </div>

          <div>
            <h3>🔒 Secure Shopping</h3>

            <p>
              Your information stays protected.
            </p>
          </div>

          <div>
            <h3>✅ Quality Products</h3>

            <p>
              Products from trusted brands.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer>
        <h2>TechKart</h2>

        <p>
          Smart Technology. Better Choices.
        </p>

        <p>
          © 2026 TechKart. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
