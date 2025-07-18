import React from "react";
import ReactStars from "react-rating-stars-component";

const StarRating = ({ value, onChange, editable = false, size = 30 }) => (
  <ReactStars
    count={5}
    value={value}
    onChange={editable ? onChange : () => {}}
    size={size}
    isHalf={true}
    edit={editable}
    activeColor="#facc15" 
  />
);

export default StarRating;
