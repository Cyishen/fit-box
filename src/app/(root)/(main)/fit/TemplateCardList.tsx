import React from 'react';
import TemplateCard from './TemplateCard';
import { TemplateType } from '../fit/[menuId]/[templateId]/TemplateForm';

const CategoryIcons: { [key: string]: string } = {
  "胸": "/icons/chest.svg",
  "背": "/icons/back.svg",
  "肩": "/icons/shoulder.svg",
  "腿": "/icons/leg.svg",
  "二頭": "/icons/biceps.svg",
  "三頭": "",
};

type TemplateCardListProps = {
  selectedTemplates: TemplateType[];
  handleRemoveTemplate: (menuId: string) => void;
};

const TemplateCardList = ({ selectedTemplates, handleRemoveTemplate }: TemplateCardListProps ) => {

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3 relative'>
      {selectedTemplates.length > 0 ? (
        selectedTemplates.map((work) => (
          <TemplateCard
            key={work.cardId}
            iconSrc={CategoryIcons[work.category] || "/icons/workout.svg"}
            category={work.category}
            title={work.title}
            onRemove={() => handleRemoveTemplate(work.cardId)}
            menuId={work.menuId}
            templateId={work.cardId}
            exercises={work.exercises}
          />
        ))
      ) : ''}
    </div>
  );
};

export default TemplateCardList;
