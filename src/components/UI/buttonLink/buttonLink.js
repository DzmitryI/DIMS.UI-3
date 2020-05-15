import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../button';

const ButtonLink = ({ name, className, onClick, to }) => {
  const result = <Link to={to}>{name}</Link>;
  return <Button className={className} onClick={onClick} id={name} name={result} />;
};

ButtonLink.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonLink;
