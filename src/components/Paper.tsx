import React from 'react';

const Paper: React.FC<{ children: React.ReactNode; className?: string }> = (
  props
) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg ${props.className}`}>
      {props.children}
    </div>
  );
};

export default Paper;
