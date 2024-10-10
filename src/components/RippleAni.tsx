"use client";

import React, { ReactNode } from 'react';

interface RippleButtonProps {
  children: ReactNode;
  className?: string;
}

const RippleAni: React.FC<RippleButtonProps> = ({ children, className }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 2000);
  };

  return (
    <div onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default RippleAni;
