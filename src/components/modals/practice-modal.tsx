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

import { useRouter } from "next/navigation";
// import { getExerciseByTemplateId } from "@/actions/user-create";

import { useSession } from "next-auth/react"

import { useDayCardStore } from "@/lib/day-modal";

import { exerciseTemplates } from "@/constants/constants";



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

  // 下載模板到本地: 用dataAllTemplate 取得exercise, 彈出視窗加快顯示圖片
  const { isOpen, close, menuId, templateId, dataAllTemplate } = usePracticeModal();

  // 用戶沒登入
  const templates = useTemplateStore(state => state.templates);
  const openLocalTemplate = templates?.find(template => template?.id === templateId);
  const localExercise = openLocalTemplate?.templateExercises

  const addWorkoutSession = useWorkoutStore(state => state.addWorkoutSession);

  const [exercise, setExercise] = useState<TemplateExerciseType[]>([])

  // 第一步, useMemo緩存 dataAllTemplate有變動才更新, 避免useEffect重複執行
  const filteredData = useMemo(() => {
    return dataAllTemplate
  }, [dataAllTemplate]);

  // 第二步, 依據 templateId找尋, 彈出視窗顯示exercise
  useEffect(() => {
    if (userId) {
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
      // 用戶沒登入
      setExercise(localExercise || []);
    }
  }, [filteredData, localExercise, templateId, userId])


  // Todo? dayCard儲存本地: 新建卡片儲存本地 
  const { setDayCard } = useDayCardStore();

  const handleToWorkoutSession = async () => {
    const existingSessionId = localStorage.getItem('currentSessionId');
    const newSessionId = existingSessionId || Date.now().toString();

    const copyTitle = dataAllTemplate.find(item => item.id === templateId)?.templateTitle || '';

    try {
      if (userId) {
        // 用戶登入
        const newCurrentSession = {
          // isSynced: false,
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

        // 不儲存到資料庫
        setDayCard(newCurrentSession)

        // TODO? 測試同時儲存到資料庫
        // 1. 分開等待, 等待時間長, 會沒跳轉成功 (setDayCard可以拿到資料庫給的id)
        // const savedSessionToData = await upsertWorkoutSession(newCurrentSession);
        // if (!dayCard.find((card) => card.cardSessionId === savedSessionToData.cardSessionId)) {
        //   setDayCard(savedSessionToData as WorkoutSessionType);
        // }

        // 2. 並行, 跳轉速度快, 但setDayCard沒有拿到資料庫給的id?
        // await Promise.all([
        //   upsertWorkoutSession(newCurrentSession), 
        //   new Promise(resolve => {
        //     // 第一個api自動返回結果, 但第二個自定義的Promise需要手動標記resolve為true 
        //     if (!dayCard.find((card) => card.cardSessionId === newSessionId)) {
        //       setDayCard(newCurrentSession as WorkoutSessionType);
        //     }
        //     resolve(true);
        //   })
        // ]);


        localStorage.setItem('currentSessionId', newCurrentSession?.cardSessionId);

        router.push(`/fit/workout/${newCurrentSession.menuId}/${newCurrentSession.templateId}`);
      } else {
        // 用戶沒有登入-本地, 如果沒有currentSessionId && 但openTemplate存在，創建新訓練卡
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
              iconSrc: exercise?.iconSrc,
              isSingleWeight: exercise?.isSingleWeight,
              sets: exercise?.templateSets.map((set, index) => ({
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

          addWorkoutSession(newWorkoutSession as WorkoutSessionType);

          localStorage.setItem('currentSessionId', newWorkoutSession.cardSessionId);
        }

        router.push(`/fit/workout/${menuId}/${templateId}`);
      }
    } catch (error) {
      console.log('找不到模板', error)
    }
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
                    {exerciseTemplates.map((template, index) => {
                      if (template.name === exercise.name) {
                        return (
                          <div key={index}>
                            <img
                              src={template?.iconSrc || '/icons/dumbbell.svg'}
                              alt={exercise.name}
                              width={32}
                              height={32}
                            />
                          </div>
                        );
                      }
                    })}
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
