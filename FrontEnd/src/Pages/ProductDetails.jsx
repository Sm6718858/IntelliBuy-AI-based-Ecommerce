import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../Context/Cart";
import ReactStars from "react-rating-stars-component";

const ProductDetails = () => {
  const [cart, setCart] = useCart();
  const params = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/single-product/${params.slug}`
        );
        setProduct(data?.product);

        if (data?.product?._id && data?.product?.category?._id) {
          const related = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/related-product/${data.product._id}/${data.product.category._id}`
          );
          setRelatedProducts(related?.data?.products || []);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load product:", error);
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [params.slug]);

  const StarRating = ({ value, onChange, editable }) => (
    <ReactStars
      count={5}
      value={value}
      onChange={onChange}
      size={20}
      activeColor="#fb4f14"
      isHalf={false}
      emptyIcon={<i className="far fa-star" />}
      filledIcon={<i className="fa fa-star" />}
      edit={editable}
    />
  );

  const submitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setSubmittingReview(true);
      const auth = JSON.parse(localStorage.getItem("auth")); 
const token = auth?.token;
console.log("Submitting review with token:", token);
if (!token) {
  toast.error("You must be logged in to submit a review");
  return;
}

const { data } = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/api/review/${product._id}`,
  { rating, comment },
  { headers: { Authorization: `Bearer ${token}` } } 
);

      
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      setProduct(data.product);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="text-center my-5">
        <h4>Loading product...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${product._id}`}
            className="img-fluid"
            alt={product.name}
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>
        <div className="col-md-6">
          <h2>🛍️ Product Details</h2>
          <hr />
          <h5><strong>Name:</strong> {product.name}</h5>
          <p><strong>Description:</strong> {product.description}</p>
          <h5 className="text-success">₹ {product.price}</h5>
          <div><strong>Category:</strong> {product?.category?.name}</div>
          <div className="d-flex mt-2 align-items-center gap-2">
            <strong>Average Rating:</strong>{" "}
            <StarRating 
              value={product.averageRating || 0} 
              edit={false} 
              size={20} 
              isHalf={true}
            />
          </div>
          <button
            className="btn btn-success mt-2"
            onClick={() => {
              setCart((prevCart) => [...prevCart, product]);
              toast.success("Added to cart successfully!");
            }}
          >
            🛒 ADD TO CART
          </button>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6">
          <h4>⭐ Submit Your Review</h4>
          <div className="mb-3">
            <label className="form-label">Rating:</label>
            <StarRating 
              value={rating} 
              onChange={setRating} 
              editable={true} 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Review:</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience..."
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={submitReview}
            disabled={submittingReview}
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        <div className="col-md-6">
  <h4>🗣️ Customer Reviews</h4>
  <div
  style={{
    maxHeight: "300px",
    overflowY: "scroll",
    scrollbarWidth: "none",     
    msOverflowStyle: "none",   
  }}
  className="no-scrollbar"
>

    {product?.reviews?.length > 0 ? (
      product.reviews.map((review, index) => (
        <div key={index} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h5>{review.name}</h5>
              <StarRating value={review.rating} editable={false} />
            </div>
            <div className="card-text">{review.comment}</div>
            <small className="text-muted">
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      ))
    ) : (
      <p className="text-muted">No reviews yet</p>
    )}
  </div>
</div>
      </div>
      
      <hr />
      <div className="mt-5">
        <h4>🔁 Similar Products</h4>
        {relatedProducts.length < 1 ? (
          <div className="text-muted">No similar products found</div>
        ) : (
          <div className="d-flex flex-wrap">
            {relatedProducts.map((p) => (
              <div
                key={p._id}
                className="card m-2"
                style={{ width: "18rem", minHeight: "400px" }}
              >
                <img
            src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${product._id}`}
            alt={product.name}
            className="img-fluid rounded-3xl shadow-lg border"
            style={{ maxHeight: "450px", objectFit: "cover"}}
          />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{p.name}</h5>
                    <div className="card-text">{p.description.substring(0, 60)}...</div>
                    <h6 className="text-success">₹ {p.price}</h6>
                    <ReactStars 
                      value={p.averageRating || 0} 
                      edit={false} 
                      size={20} 
                      isHalf={true}
                    />
                  </div>
                  <div className="mt-2">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setCart((prevCart) => [...prevCart, p]);
                        toast.success("Added to cart successfully!");
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;