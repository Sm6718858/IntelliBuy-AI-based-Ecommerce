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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <h4 className="mt-4 text-lg font-medium text-gray-700">Loading product details...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${product._id}`}
              alt={product.name}
              className="w-full h-96 object-contain p-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/500x500?text=Product+Image";
              }}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">🛍️ {product.name}</h2>
            <div className="flex items-center mb-4">
              <StarRating value={product.averageRating || 0} edit={false} />
              <span className="ml-2 text-gray-600">{product.averageRating?.toFixed(1) || 'No'} reviews</span>
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
              {product.price > 1000 && (
                <span className="ml-2 text-sm text-gray-500">+ Free Shipping</span>
              )}
            </div>
            
            <div className="mb-6">
              <span className="block text-gray-600 mb-1"><strong>Category:</strong> {product?.category?.name}</span>
              <span className="block text-gray-600"><strong>Availability:</strong> In Stock</span>
            </div>
            
            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 mb-4"
              onClick={() => {
                setCart((prevCart) => [...prevCart, product]);
                toast.success("Added to cart successfully!");
              }}
            >
              🛒 ADD TO CART
            </button>
            
            <button
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
              onClick={() => {
                setCart((prevCart) => [...prevCart, product]);
                navigate("/cart");
              }}
            >
              🚀 BUY NOW
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-indigo-700 mb-6">⭐ Submit Your Review</h3>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Rating</label>
              <StarRating value={rating} onChange={setRating} editable={true} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Review</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product..."
              />
            </div>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
              onClick={submitReview}
              disabled={submittingReview}
            >
              {submittingReview ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : "Submit Review"}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-indigo-700 mb-6">🗣️ Customer Reviews</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {product?.reviews?.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{review.name}</h4>
                      <div className="flex items-center">
                        <StarRating value={review.rating} edit={false} size={16} />
                        <span className="ml-1 text-sm text-gray-500">{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-indigo-700 mb-6">🔁 Similar Products</h3>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div key={p._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${p._id}`}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x300?text=Product+Image";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-1 truncate">{p.name}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{p.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-green-600">₹{p.price}</span>
                      <div className="flex items-center">
                        <StarRating value={p.averageRating || 0} edit={false} size={14} />
                        <span className="ml-1 text-xs text-gray-500">{p.averageRating?.toFixed(1) || '0'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium py-1 px-2 rounded transition-all duration-200"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        Details
                      </button>
                      <button
                        className="bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium py-1 px-2 rounded transition-all duration-200"
                        onClick={() => {
                          setCart((prevCart) => [...prevCart, p]);
                          toast.success("Added to cart!");
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl shadow">
              <p className="text-gray-500">No similar products found</p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">IntelliBuy</h3>
              <p className="text-indigo-200">Your smart shopping destination</p>
            </div>
           
          </div>
        
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;