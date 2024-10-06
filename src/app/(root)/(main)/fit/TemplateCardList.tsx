import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  onReorder?: (reorderedTemplates: TemplateType[]) => void;  // 使 onReorder 成為可選的
};

interface SortableItemProps {
  work: TemplateType;
  handleRemoveTemplate: (menuId: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ work, handleRemoveTemplate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: work.cardId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
  );
};

const TemplateCardList: React.FC<TemplateCardListProps> = ({
  selectedTemplates,
  handleRemoveTemplate,
  onReorder,
}) => {
  const [items, setItems] = useState<TemplateType[]>([]);

  useEffect(() => {
    setItems(selectedTemplates);
  }, [selectedTemplates]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.cardId === active.id);
        const newIndex = prevItems.findIndex((item) => item.cardId === over.id);

        const newItems = arrayMove(prevItems, oldIndex, newIndex);
        
        // 檢查 onReorder 是否為函數，如果是則調用它
        if (typeof onReorder === 'function') {
          onReorder(newItems);
        }

        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.cardId)}
        strategy={horizontalListSortingStrategy}
      >
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3 relative'>
          {items.map((work) => (
            <SortableItem 
              key={work.cardId} 
              work={work} 
              handleRemoveTemplate={handleRemoveTemplate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TemplateCardList;