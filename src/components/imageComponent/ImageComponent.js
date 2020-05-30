import React from 'react';
import PropTypes from 'prop-types';

const ImageComponent = ({ src, width, alt, className }) => {
  return (
    <div className={className}>
      <img src={src} width={width} alt={alt} />
    </div>
  );
};

ImageComponent.defaultProps = {
  width: '140px',
  alt: 'img',
};

ImageComponent.propTypes = {
  className: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  alt: PropTypes.string,
};

export default ImageComponent;
