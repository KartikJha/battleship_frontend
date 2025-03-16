import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ placeholder, value, onChange, className }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${className}`}
    />
  );
};

Input.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Input;