import React from 'react';
import Button from '../button';
import { Link } from 'react-router-dom';

const ButtonLink = ({ name, className, onClick, to }) => {
  const result = <Link to={to}>{name}</Link>;
  return <Button className={className} onClick={onClick} id={name} name={result} />;
};

export default ButtonLink;
