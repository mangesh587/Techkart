import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch product:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

const addToCart = () => {
  const existingCart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = existingCart.find(
    (item) => item.id === product._id
  );

  let updatedCart;

  if (existingProduct) {
    updatedCart = existingCart.map((item) =>
      item.id === product._id
        ? {
            ...item,
            quantity: item.quantity + quantity,
          }
        : item
    );
  } else {
    updatedCart = [
      ...existingCart,
      {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        quantity: quantity,
      },
    ];
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart)
  );

  window.dispatchEvent(new Event("cartUpdated"));
  
  alert(`${quantity} ${product.name} added to cart!`);
};

  return (
    <div className="details-page">
      <section className="details-container">
          <div className="details-image">
            {product.image.startsWith("http") ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              product.image
            )}
          </div>

        <div className="details-info">
          <span className="details-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="details-rating">
            ⭐ {product.rating} / 5
          </p>

          <h2 className="details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </h2>

          <p className="stock">
            ✓ In Stock ({product.stock} available)
          </p>

          <p className="details-description">
            {product.description}
          </p>

          <div className="quantity-section">
            <span>Quantity:</span>

            <div className="quantity-control">
              <button onClick={decreaseQuantity}>
                −
              </button>

              <span>{quantity}</span>

              <button onClick={increaseQuantity}>
                +
              </button>
            </div>
          </div>

          <div className="details-buttons">
            <button
              className="add-cart-btn"
              onClick={addToCart}
            >
              🛒 Add to Cart
            </button>

            <button className="buy-btn">
              Buy Now
            </button>
          </div>
        </div>
      </section>

      <section className="specifications">
        <h2>Product Information</h2>

        <div className="spec-table">
          <div className="spec-row">
            <strong>Category</strong>
            <span>{product.category}</span>
          </div>

          <div className="spec-row">
            <strong>Price</strong>
            <span>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="spec-row">
            <strong>Rating</strong>
            <span>⭐ {product.rating}</span>
          </div>

          <div className="spec-row">
            <strong>Stock</strong>
            <span>{product.stock} units</span>
          </div>
        </div>
      </section>

      <section className="description-section">
        <h2>About this product</h2>

        <p>
          {product.description}
        </p>
      </section>
    </div>
  );
}

export default ProductDetails;