import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ onClick, className, children, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
      } ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

export default Button;