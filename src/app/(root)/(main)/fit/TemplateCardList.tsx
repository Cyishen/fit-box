import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setTemplates(selectedTemplates);
  }, [selectedTemplates]);


  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'));

    if (draggedIndex !== index) {
      const updatedTemplates = [...templates];
      const [draggedTemplate] = updatedTemplates.splice(draggedIndex, 1);
      updatedTemplates.splice(index, 0, draggedTemplate);

      setTemplates(updatedTemplates);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3 relative'>
      {templates.length > 0 ? (
        templates.map((work, index) => (
          <div
            key={work.cardId}
            draggable
            onDragStart={(event) => handleDragStart(event, index)}
            onDrop={(event) => handleDrop(event, index)}
            onDragOver={handleDragOver}
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
