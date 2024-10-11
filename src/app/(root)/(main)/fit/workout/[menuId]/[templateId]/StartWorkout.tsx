import { useEffect, useState } from "react";
import { useWorkoutStore } from "@/lib/store";
import { useUserStore } from "@/lib/store";
import ExerciseListCard from '../../../[menuId]/[templateId]/ExerciseListCard';
import { useRouter } from "next/navigation";
import { CopyPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

type StartWorkoutProps = {
  template: TemplateType | WorkoutSessionType;
  isEditMode: boolean;
}

const StartWorkout = ({ template, isEditMode }: StartWorkoutProps) => {
  const [currentSession, setCurrentSession] = useState<WorkoutSessionType | null>();
  const router = useRouter();

  const user = useUserStore(state => state.user.userId);
  const { workoutSessions, addWorkoutSession, editWorkoutSession } = useWorkoutStore();

  useEffect(() => {
    const existingSessionId = localStorage.getItem('currentSessionId');

    if (isEditMode) {
      // 編輯模式下，使用現有的 sessionId
      const existingSession = workoutSessions.find(session => session.sessionId === existingSessionId);

      if (existingSession) {
        setCurrentSession(existingSession);
      }
    } else {
      if (!existingSessionId && template.menuId && template.templateId) {
        const newSession: WorkoutSessionType = {
          sessionId: Date.now().toString(),
          userId: user,
          menuId: template.menuId,
          templateId: template.templateId,
          templateTitle: template.templateTitle,
          date: new Date().toISOString().slice(0, 10),
          exercises: JSON.parse(JSON.stringify(template.exercises)),
        };
        addWorkoutSession(newSession);
        setCurrentSession(newSession);
        localStorage.setItem('currentSessionId', newSession.sessionId);
      }
    }
  }, [template, user, workoutSessions, addWorkoutSession, isEditMode]);


  const updateCurrentSession = (updatedSession: WorkoutSessionType) => {
    editWorkoutSession(updatedSession.sessionId, updatedSession);
    setCurrentSession(updatedSession);
  };

  // 修改動作組數
  const handleUpdateSets = (exerciseId: string, updatedSets: SetType[]) => {
    if (currentSession) {
      const updatedExercises = currentSession.exercises.map(exercise =>
        exercise.exerciseId === exerciseId ? { ...exercise, sets: updatedSets } : exercise
      );
      const updatedSession = { ...currentSession, exercises: updatedExercises };
      updateCurrentSession(updatedSession);
    }
  };

  // 左滑後, 點擊刪除
  const handleRemoveExercise = (exerciseId: string) => {
    if (currentSession) {
      const updatedExercises = currentSession.exercises.filter(
        exercise => exercise.exerciseId !== exerciseId
      );
      const updatedSession = { ...currentSession, exercises: updatedExercises };
      updateCurrentSession(updatedSession);
    }
  };

  // 動作下拉, 打開動作的組數設定
  const [openExerciseId, setOpenExerciseId] = useState<string | null>(null);
  const handleToggleExercise = (exerciseId: string) => {
    setOpenExerciseId((prev) => (prev === exerciseId ? null : exerciseId));
  };

  const handleCompleteWorkout = () => {
    localStorage.removeItem('currentSessionId');

    router.push('/fit');
  };


  return (
    <div className="sm:py-10 bg-gray-100">
      <div>
        <div className="px-4 pt-4">
          <div className='flex justify-between items-center'>
            {isEditMode ? (
              <h3 className="font-bold text-xl whitespace-nowrap">繼續訓練
              </h3>
            ) : (
              <h3 className="font-bold text-xl whitespace-nowrap">開始訓練</h3>
            )}

            <div className="flex w-full">
              <div className='w-full flex justify-end items-center px-1'>
                <p className="line-clamp-1 text-gray-400">{template.templateTitle}</p>
              </div>

              <Button
                onClick={handleCompleteWorkout}
                size='sm'
                className='font-bold'
              >
                完成
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 py-3">
          <div className='flex items-center justify-end gap-3'>
            <h3 className="font-bold">計時器</h3>
            <p className="font-bold text-3xl border px-2 py-1 rounded-lg">00:00</p>
          </div>
        </div>

        <div className='flex items-center justify-end gap-3 px-4'>
          <h3 className="font-bold">添加動作</h3>

          <button
            type="button"
            onClick={() => router.push(`/action`)}
            className='w-10 h-10 flex justify-center items-center duration-300 rounded-full bg-[#66CCFF] hover:brightness-110'
          >
            <div className='w-full h-full rounded-full flex justify-center items-center hover:invert'>
              <CopyPlus className='w-5' />
            </div>
          </button>
        </div>
      </div>

      {currentSession && (
        <div className='mt-3 px-3 rounded-t-2xl sm:rounded-2xl bg-slate-200 mb-16'>
          <div className='pt-3'>
            <div className='overflow-y-scroll max-h-[500px] min-h-[500px]'>
              <div className='flex flex-col gap-3 pb-20'>
                {currentSession.exercises.map((exercise) => (
                  <ExerciseListCard
                    key={exercise.exerciseId}
                    exercise={exercise}
                    handleRemoveExercise={handleRemoveExercise}
                    onUpdateSets={handleUpdateSets}
                    isOpen={openExerciseId === exercise.exerciseId}
                    onToggle={() => handleToggleExercise(exercise.exerciseId)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartWorkout;
