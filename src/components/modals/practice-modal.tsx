"use client";


import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { usePracticeModal } from "@/lib/use-practice-modal";
import Link from "next/link";
import { useTemplateStore, useWorkoutStore } from "@/lib/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { getExerciseByTemplateId } from "@/actions/user-create";

import { useSession } from "next-auth/react"
import { upsertWorkoutSession } from "@/actions/user-create";

import { useDayCardStore } from "@/lib/day-modal";



// const fetchTemplateByTemplateId = async (templateId: string) => {
//   const response = await fetch(`/api/template/${templateId}`, {
//     method: 'GET',
//   });
//   if (!response.ok) {
//     throw new Error('Failed to fetch template');
//   }
//   return response.json();
// }

export const PracticeModal = () => {
  const router = useRouter();
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [isClient, setIsClient] = useState(false);

  // 無用戶本地
  const templates = useTemplateStore(state => state.templates);
  const openLocalTemplate = templates.find(template => template.id === templateId);
  const localExercise = openLocalTemplate?.templateExercises

  const addWorkoutSession = useWorkoutStore(state => state.addWorkoutSession);

  // Todo* data儲存本地: 用dataAllTemplate 取得exercise, 彈出視窗加快顯示圖片
  const { isOpen, close, menuId, templateId, dataAllTemplate } = usePracticeModal();
  const [exercise, setExercise] = useState<TemplateExerciseType[]>([])

  // 第一步, useMemo緩存 dataAllTemplate有變動才更新, 避免useEffect重複執行
  const filteredData = useMemo(() => {
    return dataAllTemplate
  }, [dataAllTemplate]);

  // 第二步, 依據 templateId找尋, 彈出視窗顯示exercise
  useEffect(() => {
    if (userId) {
      // data儲存本地,
      const selectedTemplate = filteredData.find(item => item.id === templateId);
      const exercisesToRender = selectedTemplate?.templateExercises;

      setExercise(exercisesToRender || []);

      // 資料庫抓取, 彈出視窗顯示圖片較慢
      // 伺服器運行
      // const exerciseList = await getExerciseByTemplateId(templateId);
      // setExercise(exerciseList as ExerciseType[]);

      // 一般 api 請求
      // await fetchTemplateByTemplateId(templateId)
      //   .then((data) => {
      //     setExercise(data);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
    } else {
      // 本地
      setExercise(localExercise || []);
    }
  }, [filteredData, localExercise, templateId, userId])


  // Todo? dayCard儲存本地: 新建卡片儲存本地 
  const { dayCard, setDayCard } = useDayCardStore();

  const handleToWorkoutSession = async () => {
    const existingSessionId = localStorage.getItem('currentSessionId');
    const newSessionId = existingSessionId || Date.now().toString();

    const copyTitle = dataAllTemplate.find(item => item.id === templateId)?.templateTitle || '';

    try {
      if (userId) {
        // 資料庫建立訓練卡
        const newCurrentSession = {
          cardSessionId: newSessionId,
          userId: userId,
          menuId: menuId ?? '',
          templateId: templateId ?? '',
          templateTitle: copyTitle,
          date: new Date().toISOString().slice(0, 10),
          createdAt: new Date().toISOString(),
          startTime: null,
          endTime: null,
          notes: null,
          exercises: exercise.map(exercise => ({
            ...exercise,
            sets: exercise.templateSets.map(set => ({
              ...set,
              isCompleted: false
            })),
          })),
        }
        const savedSessionToData = await upsertWorkoutSession(newCurrentSession);

        // 更新本地狀態 (包含資料庫返回的 id)
        if (!dayCard.find((card) => card.cardSessionId === savedSessionToData.cardSessionId)) {
          setDayCard([...dayCard, savedSessionToData as WorkoutSessionType]);
        }

        localStorage.setItem('currentSessionId', newCurrentSession?.cardSessionId || '');
        router.push(`/fit/workout/${menuId}/${templateId}`);
      } else {
        // 本地, 如果沒有currentSessionId && 但openTemplate存在，創建新訓練卡
        if (!existingSessionId && openLocalTemplate) {
          const newWorkoutSession: WorkoutSessionType = {
            cardSessionId: newSessionId,
            userId: userId || "Guest",
            date: new Date().toISOString().slice(0, 10),
            createdAt: new Date().toISOString(),
            startTime: null,
            endTime: null,
            notes: null,
            menuId: openLocalTemplate.menuId,
            templateId: openLocalTemplate.id || '',
            templateTitle: openLocalTemplate.templateTitle,
            exercises: openLocalTemplate.templateExercises.map(exercise => ({
              movementId: exercise.movementId,
              name: exercise.name,
              exerciseCategory: exercise.exerciseCategory,
              sets: exercise.templateSets.map((set, index) => ({
                id: `${set.movementId}-${index + 1}`,
                movementId: set.movementId,
                leftWeight: set.leftWeight,
                rightWeight: set.rightWeight,
                repetitions: set.repetitions,
                totalWeight: set.totalWeight,
                isCompleted: false
              })),
            })),
          };

          // 添加新訓練卡到 store
          addWorkoutSession(newWorkoutSession as WorkoutSessionType);

          // 儲存 currentSessionId 以便後續頁面操作
          localStorage.setItem('currentSessionId', newWorkoutSession.cardSessionId);
        }

        // 導航到 WorkoutPage
        router.push(`/fit/workout/${menuId}/${templateId}`);
      }
    } catch (error) {
      console.log('找不到模板', error)
    }

    close()
  };

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            {openLocalTemplate?.templateTitle}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            持續訓練, 維持體態
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-100 px-3 py-5">
          <div className="grid grid-cols-2 gap-3 overflow-y-scroll min-h-20 max-h-48">
            {exercise.map((exercise) => (
              <div key={exercise.movementId}>
                <div className="p-2 bg-white rounded-md">
                  <div className="flex flex-col items-center">
                    <Image
                      src='/icons/dumbbell.svg'
                      alt={exercise.name}
                      width={36}
                      height={36}
                    />
                    <p className="text-sm mt-2">{exercise.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex w-full gap-3">
            <Link href={`/fit/${menuId}/${templateId}/update`} className="flex w-full">
              <Button
                onClick={close}
                className="w-full"
              >
                編輯模板 ({exercise?.length})
              </Button>
            </Link>

            <div className="flex w-full"
              onClick={handleToWorkoutSession}
            >
              <Button className="w-full">
                開始訓練
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
