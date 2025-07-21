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
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [params.slug]);

  const StarRating = ({ value, onChange, editable, size = 20 }) => (
    <ReactStars
      count={5}
      value={value}
      onChange={onChange}
      size={size}
      activeColor="#fb4f14"
      isHalf={false}
      edit={editable}
    />
  );

  const submitReview = async () => {
    if (rating === 0 || !comment.trim()) {
      toast.error("Please fill out all fields.");
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
      toast.error(error.response?.data?.message || "Submission failed.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center text-sm text-gray-600 mb-6 font-bold">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center font-bold text-indigo-600 hover:text-indigo-800 mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <span>/</span>
          <span className="ml-2 capitalize">{product.category?.name}</span>
          <span>/</span>
          <span className="ml-2 text-indigo-600 font-bold">{product.name}</span>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 flex justify-center items-center h-full min-h-[400px] border-animated bg-white rounded-md">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${product._id}`}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain transition duration-300 hover:scale-105 "
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500x500?text=Product+Image";
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800 mb-2 mx-4">{product.name}</h2>
                {/* <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {product.category?.name}
                </span> */}
              </div>

              <div className="flex items-center mb-4 mx-4">
                <StarRating value={product.averageRating || 0} editable={false} />
                <span className="ml-2 text-sm text-gray-600">
                  {product.averageRating?.toFixed(1) || "No"} reviews
                  {product.reviews?.length > 0 && (
                    <span className="text-indigo-600 ml-1">({product.reviews.length})</span>
                  )}
                </span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold mx-4 text-blue-950">₹{product.price}</span>
                {product.price > 1000 && (
                  <span className="ml-4 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Free Shipping
                  </span>
                )}
              </div>

              <div className="prose max-w-none text-gray-600 mb-6 px-2.5 mx-4">
                <p>{product.description}</p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 ">In Stock & Ready to Ship</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3 flex">
              <button style={{ borderRadius: '20px' }}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                onClick={() => {
                  setCart([...cart, product]);
                  toast.success("Added to cart!");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
              <button
                style={{ borderRadius: '20px' }}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                onClick={() => {
                  setCart([...cart, product]);
                  navigate("/cart");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Buy Now
              </button>
            </div>
          </div>
        </section>
        <br />
        {/* Reviews Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div
            style={{
              borderBottomRightRadius: '15px',
              borderBottomLeftRadius: '15px',
              height: '350px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transform: 'translateZ(0)'
            }}
            className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-l-4 border-r-4 
      border-t-pink-500
      border-l-blue-700 border-r-blue-700"
            will-change-transform
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center mx-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Write a Review
            </h3>

            <div className="mb-6 mx-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 resize-none">Your Rating</label>
              <div className="flex items-center resize-none">
                <StarRating value={rating} onChange={setRating} editable={true} size={28} />
                <span className="ml-3 text-gray-500 text-sm resize-none">
                  {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
                </span>
              </div>
            </div>

            <div className="mb-6 mx-4 flex-grow" style={{ minHeight: '150px', overflow: 'hidden' }}>
              <label style={{overflow:'none'}} className="block text-sm font-medium text-gray-700 mb-2 resize-none">Your Review</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-200 transition resize-none"
                placeholder="Share your thoughts about this product..."
                style={{ minHeight: '150px' }}
              />
            </div>

            <button
              style={{
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
                marginTop: 'auto'
              }}
              className={`w-full py-3 px-4 font-semibold text-white transition-all duration-300 ${submittingReview ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                }`}
              onClick={submitReview}
              disabled={submittingReview}
            >
              {submittingReview ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Review'}
            </button>
          </div>

          {/* Customer Reviews */}
          <div
            className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-b-4 border-l-4 border-r-4 
      border-t-pink-500 border-b-pink-500 
      border-l-blue-700 border-r-blue-700"
            style={{ height: '350px' }} 
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center px-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Customer Reviews
            </h3>

            {product.reviews?.length > 0 ? (
              <div
                className="space-y-6 pr-3 mx-4 custom-scrollbar"
                style={{
                  height: 'calc(100% - 3rem)', // Adjust based on heading height
                  overflowY: 'auto'
                }}
              >
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{review.name}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center bg-indigo-50 px-2 py-1 rounded">
                        <StarRating value={review.rating} editable={false} size={16} />
                        <span className="ml-1 text-sm font-medium text-indigo-800">{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-8"
                style={{ height: 'calc(100% - 3rem)' }} // Adjust based on heading height
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="mt-2 text-lg font-medium text-gray-600">No reviews yet</h4>
                <p className="mt-1 text-gray-500">Be the first to review this product</p>
              </div>
            )}
          </div>
        </section>

        {/* Similar Products */}
        <br /><br />
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            You May Also Like
          </h3>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div key={p._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center p-4">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/api/product-photo/${p._id}`}
                      alt={p.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300?text=Product";
                      }}
                    />
                    <button
                      onClick={() => {
                        setCart([...cart, p]);
                        toast.success("Added to cart!");
                      }}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-indigo-50 transition"
                      title="Add to cart"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-1 truncate">{p.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{p.description}</p>

                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-gray-900">₹{p.price}</span>
                      <div className="flex items-center">
                        <StarRating value={p.averageRating || 0} editable={false} size={16} />
                        <span className="ml-1 text-xs text-gray-500">{p.averageRating?.toFixed(1) || 0}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => navigate(`/product/${p.slug}`)}
                        className="flex-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 py-1 px-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setCart([...cart, p]);
                          toast.success("Added to cart!");
                        }}
                        className="flex-1 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 py-1 px-2 rounded-lg transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="mt-3 text-lg font-medium text-gray-600">No similar products found</h4>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;