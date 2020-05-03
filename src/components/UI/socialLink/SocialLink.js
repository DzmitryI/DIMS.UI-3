import React from 'react';
import PropTypes from 'prop-types';

const SocialLink = ({ className, href, src, alt }) => {
  return (
    <div className={className}>
      <a href={href} target='_blank' rel='noopener noreferrer'>
        <img src={src} width='28px' alt={alt} />
      </a>
    </div>
  );
};

SocialLink.defaultProps = {
  className: 'imgMain-wrap',
  href: '#',
};

SocialLink.propTypes = {
  className: PropTypes.string.isRequired,
  alt: PropTypes.string,
  href: PropTypes.string,
};

export default SocialLink;
