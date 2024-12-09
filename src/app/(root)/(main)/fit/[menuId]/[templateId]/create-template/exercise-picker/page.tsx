"use client";


import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTemplateStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

import FitSideBar from './FitSideBar';
import { exerciseTemplates } from '@/constants/constants';

import { useSession } from 'next-auth/react'
import { getTemplateExerciseByTemplateId, upsertExercise } from '@/actions/user-create';
import { usePracticeModal } from '@/lib/use-practice-modal';
import { Loader } from 'lucide-react';



const ExercisePicker = ({ params }: { params: { menuId: string, templateId: string } }) => {
  const { templateId } = params;
  const { data: session } = useSession()
  const userId = session?.user?.id

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // 用戶沒登入, 本地
  const templates = useTemplateStore(state => state.templates);
  const currentTemplate = templates.find(template => template.id === templateId);

  // data儲存本地, 用dataAllTemplate, 取得exercise, 加快顯示速度
  const { dataAllTemplate, setDataAllTemplate } = usePracticeModal();
  // 選中的動作管理
  const [selectedExercises, setSelectedExercises] = useState<TemplateExerciseType[]>([]);

  // 左邊選單分類
  const [category, setCategory] = useState<string>('胸');
  const filteredWorkouts = exerciseTemplates.filter(
    (exercise) => exercise.exerciseCategory === category
  );
  // 動作分類
  const categoryCounts = selectedExercises.reduce((acc, exercise) => {
    const category = exercise.exerciseCategory;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  useEffect(() => {
    const fetchSelectedExercises = async () => {
      if (userId) {
        // 資料庫, 讀取已存在動作, 速度慢, 可用dataAllTemplate本地
        const existingExercises = await getTemplateExerciseByTemplateId(templateId);
        setSelectedExercises(existingExercises);
      } else {
        // 本地
        if (currentTemplate) {
          setSelectedExercises(currentTemplate.templateExercises);
        }
      }
    };

    fetchSelectedExercises();
  }, [currentTemplate, templateId, userId]);


  const handleSaveExercises = async () => {
    setIsLoading(true);

    try {
      if (userId) {
        // 更新動作到資料庫
        await upsertExercise(selectedExercises, templateId);

        // TODO* data儲存本地, 更新動作到 setDataAllTemplate
        if (dataAllTemplate) {
          const updatedDataAllTemplate = dataAllTemplate.map(item => {
            if (item.id === templateId) {
              return {
                ...item,
                templateExercises: selectedExercises,
              };
            }
            return item;
          });
          setDataAllTemplate(updatedDataAllTemplate as TemplateType[]);
        }
      } else {
        // 本地
        if (currentTemplate) {
          const updatedTemplate: TemplateType = {
            ...currentTemplate,
            templateExercises: selectedExercises,
          };

          const updateTemplate = useTemplateStore.getState().editTemplate;
          updateTemplate(templateId, updatedTemplate);
        }
      }

      router.back()
    } catch (error) {
      console.error("Error saving exercises:", error);
      setIsLoading(false);
      alert("儲存失敗，請稍後再試！");
    }
  };

  const handleToggleExercise = (exercise: TemplateExerciseType) => {
    const isSelected = selectedExercises.some(ex => ex.movementId === exercise.movementId);

    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(ex => ex.movementId !== exercise.movementId));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };


  return (
    <div className='flex pb-10 sm:pt-10 bg-gray-100 sm:bg-white h-screen'>
      <div className='forMobile sm:forWeb'>
        <div className="bg-gray-100 p-4 sm:rounded-2xl">
          <div className='flex justify-between'>
            <Button size='sm' onClick={() => router.back()} className='font-bold'>返回</Button>
            <Button
              size='sm'
              type="button" disabled={isLoading}
              className="font-bold"
              onClick={handleSaveExercises}
            >
              {isLoading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                </>
              ) : (
                <>儲存 {selectedExercises.length}</>
              )}
            </Button>
          </div>

          <div className='flex mt-5 gap-3 mb-20'>
            <div className='w-32'>
              <h3 className="font-bold">選擇動作</h3>
              <hr className='my-2' />

              <FitSideBar setCategoryState={setCategory} categoryCounts={categoryCounts}/>
            </div>

            <div className='w-full no-select'>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredWorkouts.map((exercise) => (
                  <div
                    key={exercise.movementId}
                    onClick={() => handleToggleExercise(exercise)}
                    className={`p-2 rounded-md cursor-pointer 
                    ${selectedExercises.some(select => select.movementId === exercise.movementId) ? 'bg-[#66CCFF] ring-1 ring-offset-2 ring-blue-500' : 'bg-white'}`
                    }
                  >
                    <div key={exercise.movementId}>
                      <div className="p-2">
                        <div className="flex flex-col items-center">
                          <img
                            src={exercise?.iconSrc || '/icons/dumbbell.svg'}
                            alt={exercise.name}
                            width={36}
                            height={36}
                          />
                          <p className={`text-sm mt-2 ${selectedExercises.some(select => select.movementId === exercise.movementId) ? 'text-black' : 'text-muted-foreground'}`}>
                            {exercise.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePicker;
