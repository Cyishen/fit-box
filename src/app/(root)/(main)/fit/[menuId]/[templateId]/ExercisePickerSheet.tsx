"use client"


import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

import BottomSheet from '@/components/BottomSheet'
import FitSideBar from '@/components/FitSideBar';

import { useSession } from 'next-auth/react'
import { useTemplateStore } from '@/lib/store';

import { exerciseTemplates } from '@/constants/constants';
import { getTemplateExerciseByTemplateId, upsertExercise } from '@/actions/user-create';
import { usePracticeModal } from '@/lib/use-practice-modal';



type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  templateId?: string
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
}
const ExercisePickerSheet = ({ isOpen, setIsOpen, templateId, setTemplateState }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [isLoading, setIsLoading] = useState(false);

  // 用戶沒登入, 本地
  const templates = useTemplateStore(state => state.templates);
  const findLocal = templates.find(template => template.id === templateId);
  const localMovement = findLocal?.templateExercises.map(ex => ex.movementId) || [];

  // 下載模板到本地: 用dataAllTemplate, 取得exercise, 加快顯示速度
  const { dataAllTemplate } = usePracticeModal();
  const findData = dataAllTemplate.find(item => item.id === templateId);
  const dataMovement = findData?.templateExercises.map(ex => ex.movementId) || [];

  const choseFolder = userId ? dataMovement : localMovement;

  // 選中的動作管理
  const [selectedExercises, setSelectedExercises] = useState<TemplateExerciseType[]>([]);
  const showSelectedMovementId = selectedExercises.map(ex => ex.movementId);

  // 找出新增的動作不存在於原始資料
  const addedMovementIds = showSelectedMovementId.filter(id => !choseFolder.includes(id));
  // 找出刪除的動作
  const removedMovementIds = choseFolder.filter(id => !showSelectedMovementId.includes(id));
  // 判斷是否有變化
  const hasChanges = addedMovementIds.length > 0 || removedMovementIds.length > 0;

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
        const existingExercises = await getTemplateExerciseByTemplateId(templateId as string);
        setSelectedExercises(existingExercises);
      } else {
        // 用戶沒登入
        if (findLocal) {
          setSelectedExercises(findLocal.templateExercises);
        }
      }
    };

    fetchSelectedExercises();
  }, [userId, templateId, findLocal]);

  const handleSaveExercises = async () => {
    setIsLoading(true);

    try {
      if (userId) {
        // 更新動作到資料庫
        const updatedExercises = await upsertExercise(selectedExercises, templateId as string);
        // 更新setTemplateState狀態, 讓列表能更新 UI
        setTemplateState(prevTemplate => ({
          ...prevTemplate,
          templateExercises: updatedExercises,
        }));

        // 需要更新 dataAllTemplate 目前測試不用?
        // if (dataAllTemplate) {
        //   const updatedDataAllTemplate = dataAllTemplate.map(item => {
        //     if (item.id === templateId) {
        //       return {
        //         ...item,
        //         templateExercises: selectedExercises,
        //       };
        //     }
        //     return item;
        //   });
        //   setDataAllTemplate(updatedDataAllTemplate as TemplateType[]);
        // }
      } else {
        // 用戶沒登入
        if (findLocal) {
          const updatedTemplate: TemplateType = {
            ...findLocal,
            templateExercises: selectedExercises,
          };

          const updateTemplate = useTemplateStore.getState().editTemplate;
          updateTemplate(templateId as string, updatedTemplate);
        }
      }

      setIsOpen(false);
      setIsLoading(false);
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
    <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className='flex justify-end px-4 bg-gray-100 sticky top-10 pb-2'>
        <Button
          size='sm'
          type="button"
          disabled={isLoading}
          className="font-bold"
          onClick={handleSaveExercises}
        >
          {isLoading ? (
            <>
              <Loader size={14} className="animate-spin" />
            </>
          ) : (
            <>{hasChanges ? '變更' : '已選'} {selectedExercises.length}</>
          )}
        </Button>
      </div>

      <div className='flex mt-1 gap-3 mb-20 px-4'>
        <div className='w-28'>
          <h3 className="font-bold">選擇動作</h3>
          <hr className='my-2' />

          <FitSideBar
            category={category}
            setCategoryState={setCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        <div className='w-full no-select'>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredWorkouts.map((exercise) => (
              <div
                key={exercise.movementId}
                onClick={() => handleToggleExercise(exercise)}
                className={`p-2 rounded-md cursor-pointer
                    ${selectedExercises.some(select => select.movementId === exercise.movementId)
                    ? 'bg-white ring-1 ring-offset-2 ring-blue-500'
                    : 'bg-white'
                  }`}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={exercise.iconSrc as string}
                    alt={exercise.name}
                    width={36}
                    height={36}
                    className='object-contain w-16'
                  />
                  <p
                    className={`text-sm mt-2 line-clamp-1 
                      ${selectedExercises.some(select => select.movementId === exercise.movementId)
                        ? 'text-black'
                        : 'text-muted-foreground'
                      }`}
                  >
                    {exercise.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  )
}

export default ExercisePickerSheet