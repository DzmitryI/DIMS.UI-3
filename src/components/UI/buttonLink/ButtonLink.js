import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '../button';

const ButtonLink = ({ name, className, onClick, to }) => {
  const result = <Link to={to}>{name}</Link>;
  return <Button className={className} onClick={onClick} id={name} name={result} />;
};

ButtonLink.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  to: PropTypes.string.isRequired,
};

export default ButtonLink;
