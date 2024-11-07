"use client";


import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTemplateStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import FitSideBar from './FitSideBar';
import { exerciseTemplates } from '@/constants/constants';

import { useSession } from 'next-auth/react'
import { getExerciseByTemplateId, upsertExercise } from '@/actions/user-create';
import { usePracticeModal } from '@/lib/use-practice-modal';
import { Loader } from 'lucide-react';



const ExercisePicker = ({ params }: { params: { menuId: string, templateId: string } }) => {
  const router = useRouter();
  const { templateId } = params;

  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 本地存儲
  const templates = useTemplateStore(state => state.templates);
  const currentTemplate = templates.find(template => template.templateId === templateId);

  // TODO* 測試透過 dataAllTemplateSession 取得exercise, 加快顯示速度
  const { dataAllTemplateSession, setDataAllTemplateToSession } = usePracticeModal();

  // 選中的動作管理
  const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>([]);

  useEffect(() => {
    const fetchSelectedExercises = async () => {
      if (userId) {
        // 資料庫
        const existingExercises = await getExerciseByTemplateId(templateId);
        setSelectedExercises(existingExercises as ExerciseType[]);
      } else {
        // 本地
        if (currentTemplate) {
          setSelectedExercises(currentTemplate.exercises);
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
        await upsertExercise(selectedExercises, templateId, null);

        // TODO* 同時更新動作到 setDataAllTemplate
        if (dataAllTemplateSession) {
          const updatedDataAllTemplate = dataAllTemplateSession.map(item => {
            if (item.templateId === templateId) {
              return {
                ...item,
                exercises: selectedExercises,
              };
            }
            return item;
          });
          setDataAllTemplateToSession(updatedDataAllTemplate);
        }
      } else {
        // 本地
        if (currentTemplate) {
          const updatedTemplate: TemplateType = {
            ...currentTemplate,
            exercises: selectedExercises,
          };

          const updateTemplate = useTemplateStore.getState().editTemplate;
          updateTemplate(templateId, updatedTemplate);
        }
      }

      router.back()
    } catch (error) {
      console.error("Error saving exercises:", error);
      alert("儲存失敗，請稍後再試！");
    }

    setIsLoading(false);
  };

  const handleToggleExercise = (exercise: ExerciseType) => {
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

          <div className='flex mt-5 gap-3'>
            <div className='w-32'>
              <h3 className="font-bold">選擇動作</h3>
              <hr className='my-2' />

              <FitSideBar />
            </div>

            <div className='w-full'>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {exerciseTemplates.map((exercise) => (
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
                          <Image
                            src='/icons/dumbbell.svg'
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
