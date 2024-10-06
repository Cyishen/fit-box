import React, { useState, useEffect, useRef } from 'react';
import TemplateCard from './TemplateCard';
import { TemplateType } from '../fit/[menuId]/[templateId]/TemplateForm';

const CategoryIcons: { [key: string]: string } = {
  "胸": "",
  "背": "/icons/back.svg",
  "肩": "/icons/shoulder.svg",
  "腿": "/icons/leg.svg",
  "二頭": "",
  "三頭": "",
};

type TemplateCardListProps = {
  selectedTemplates: TemplateType[];
  handleRemoveTemplate: (menuId: string) => void;
};

const TemplateCardList = ({ selectedTemplates, handleRemoveTemplate }: TemplateCardListProps) => {
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [touchY, setTouchY] = useState<number | null>(null);
  const templateRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDragging = useRef(false);

  useEffect(() => {
    setTemplates(selectedTemplates);
  }, [selectedTemplates]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    isDragging.current = true;
    event.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const draggedIdx = parseInt(event.dataTransfer.getData('text/plain'));
    handleReorder(draggedIdx, index);
    isDragging.current = false;
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    setTouchY(event.touches[0].clientY);
    isDragging.current = true;
  };
  
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (draggedIndex === null || touchY === null) return;

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - touchY;

    if (Math.abs(deltaY) > 20) {
      const currentIndex = Math.floor((currentY - 60) / 80);
      if (currentIndex >= 0 && currentIndex < templates.length && currentIndex !== draggedIndex) {
        handleReorder(draggedIndex, currentIndex);
        setDraggedIndex(currentIndex);
        setTouchY(currentY);
      }
    }
  };
  
  const handleTouchEnd = () => {
    setDraggedIndex(null);
    setTouchY(null);
    isDragging.current = false;
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const updatedTemplates = [...templates];
    const [draggedTemplate] = updatedTemplates.splice(fromIndex, 1);
    updatedTemplates.splice(toIndex, 0, draggedTemplate);
    setTemplates(updatedTemplates);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      // 在這裡處理正常的點擊事件，例如導航到詳細頁面
      // 如果您沒有特定的點擊處理邏輯，可以省略這個 else 塊
    }
  };

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3 relative'>
      {templates.length > 0 ? (
        templates.map((work, index) => (
          <div
            key={work.cardId}
            ref={(el: HTMLDivElement | null) => {
              templateRefs.current[index] = el;
            }}
            draggable
            onDragStart={(event) => handleDragStart(event, index)}
            onDrop={(event) => handleDrop(event, index)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onTouchStart={(event) => handleTouchStart(event, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(event) => handleClick(event)}
            style={{
              transition: 'transform 0.2s',
              transform: draggedIndex === index ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <TemplateCard
              iconSrc={CategoryIcons[work.category] || "/icons/dumbbell.svg"}
              category={work.category}
              title={work.title}
              onRemove={() => handleRemoveTemplate(work.cardId)}
              menuId={work.menuId}
              templateId={work.cardId}
              exercises={work.exercises}
            />
          </div>
        ))
      ) : (
        <div className='flex justify-center items-center w-40 h-20 border p-2 border-dashed border-black rounded-lg'>
          <p className='font-bold capitalize text-sm text-wrap'>
            訓練模板
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateCardList;