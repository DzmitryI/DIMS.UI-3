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
  alt: 'icon',
  src: '#',
};

SocialLink.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  href: PropTypes.string,
  src: PropTypes.string,
};

export default SocialLink;
