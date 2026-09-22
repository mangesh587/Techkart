import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const initialCategory =
    searchParams.get("category") || "All";

  const [category, setCategory] =
    useState(initialCategory);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Failed to fetch products:",
          error
        );
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setCategory(
      searchParams.get("category") || "All"
    );
  }, [searchParams]);

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    }
  );

  return (
    <div className="products-page">
      <section className="products-header">
        <h1>All Products</h1>

        <p>
          Explore our latest mobile and electronic
          products.
        </p>
      </section>

      <section className="product-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="All">
            All Categories
          </option>

          <option value="Smartphones">
            Smartphones
          </option>

          <option value="Laptops">
            Laptops
          </option>

          <option value="Audio">
            Audio
          </option>

          <option value="Smartwatches">
            Smartwatches
          </option>
        </select>
      </section>

      {loading ? (
        <p className="no-products">
          Loading products...
        </p>
      ) : (
        <section className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                className="shop-product-card"
                key={product._id}
              >
                <div className="shop-product-image">
                  {product.image?.startsWith(
                    "http"
                  ) ? (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    product.image
                  )}
                </div>

                <div className="shop-product-info">
                  <span className="product-category">
                    {product.category}
                  </span>

                  <h2>{product.name}</h2>

                  <p className="rating">
                    ⭐ {product.rating}
                  </p>

                  <div className="product-bottom">
                    <h3>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </h3>

                    <Link
                      to={`/product/${product._id}`}
                      className="view-product-btn"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products">
              No products found.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export default Products;