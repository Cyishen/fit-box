import React from 'react';
import TemplateCard from './TemplateCard';


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

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3 relative'>
      {selectedTemplates.length > 0 ? (
        selectedTemplates.map((work) => (
          <TemplateCard
            key={work.cardId}
            iconSrc={CategoryIcons[work.category] || "/icons/dumbbell.svg"}
            category={work.category}
            title={work.title}
            onRemove={() => handleRemoveTemplate(work.cardId)}
            menuId={work.menuId}
            templateId={work.cardId}
            exercises={work.exercises}
          />
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
