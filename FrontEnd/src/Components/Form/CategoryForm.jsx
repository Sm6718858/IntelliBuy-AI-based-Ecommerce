import React from 'react';

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <form onSubmit={handleSubmit} className='d-flex flex-column gap-3'>
      <input
        type="text"
        placeholder='Enter new Category...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="form-control"
      />
      <button type="submit" className='btn btn-primary'>Add Category</button>
    </form>
  );
};

export default CategoryForm;
