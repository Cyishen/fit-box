import React from 'react';
import TemplateCard from './TemplateCard';
import { Loader } from 'lucide-react';


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
  isPending: boolean;
};

const TemplateCardList = ({ selectedTemplates, handleRemoveTemplate, isPending }: TemplateCardListProps) => {

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3 relative'>
      {isPending && <Loader size={30} className="animate-spin absolute top-1/2 left-1/2 z-50" />}

      {selectedTemplates.length > 0 ? (
        selectedTemplates.map((temp) => (
          <TemplateCard
            key={temp.templateId}
            iconSrc={CategoryIcons[temp.templateCategory] || "/icons/dumbbell.svg"}
            templateCategory={temp.templateCategory}
            templateTitle={temp.templateTitle}
            onRemove={() => handleRemoveTemplate(temp.templateId ?? '')}
            menuId={temp.menuId}
            templateId={temp.templateId ?? ''}
            exercises={temp.exercises}
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
