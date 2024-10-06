"use client"

import React, { useState } from 'react';

type DropAreaProps = {
  onDrop: (id: string, targetIndex: number) => void;
  targetIndex: number;
};

const DropArea: React.FC<DropAreaProps> = ({ onDrop, targetIndex }) => {
  const [showDrop, setShowDrop] = useState(true);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain");
    onDrop(draggedId, targetIndex);
    setShowDrop(false);
  };

  return (
    <section
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
      onDrop={handleDrop}
      className={showDrop ? 'drop_area' : 'hide_drop'}
    >
      Drop here
    </section>
  );
};

export default DropArea;
