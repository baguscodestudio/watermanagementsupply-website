import React from 'react';

const Paper: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}> = (props) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export default Paper;
