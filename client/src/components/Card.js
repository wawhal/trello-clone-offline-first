import React from 'react';

const Card = React.forwardRef(({children, ...props}, ref) => {
  console.log(ref);
  return (
    <div className="card" {...props}>
      {children}
    </div>
  );
});

export const Body = ({ children }) => {
  return (
    <div className="card-body">
      {children}
    </div>
  )
}

export const Text = ({ children }) => {
  return (
    <p className="card-text">
      {children}
    </p>
  )
}

export const Footer = ({ children }) => {
  return (
    <div className="card-footer">
      {children}
    </div>
  )
}

export default Card;