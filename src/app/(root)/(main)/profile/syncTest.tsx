import React from 'react'

const syncTest = () => {
    // const { workoutSessions } = useWorkoutStore();
  // const { menus } = useMenuStore();
  // const { templates } = useTemplateStore();

  //測試把本地同步到資料庫
  // const syncInProgress = useRef(false);
  // const syncWorkoutSessions = async (userId: string, menus: MenuType[], templates: TemplateType[], workoutSessions: WorkoutSessionType[]) => {
  //   if (syncInProgress.current) return;

  //   try {
  //     syncInProgress.current = true;
  //     const response = await fetch(`/api/users/${userId}/sync`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         userId,
  //         workoutSessions: workoutSessions,
  //         menus: menus,
  //         templates: templates,
  //       })
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Sync failed 資料同步失敗');
  //     }

  //     const result = await response.json();

  //     if (result.success) {
  //       // 同步成功後清除本地數據
  //     }

  //     return result;
  //   } catch (error) {
  //     console.error('Sync error:', error);
  //     throw error;
  //   } finally {
  //     syncInProgress.current = false;
  //   }
  // };

  // useEffect(() => {
  //   const syncData = async () => {
  //     if (!session?.user?.id || workoutSessions.length === 0) return;

  //     try {
  //       await syncWorkoutSessions(session.user.id, menus, templates,  workoutSessions);
  //     } catch (error) {
  //       console.error('Sync failed:', error);
  //     }
  //   };

  //   syncData();
  // }, [session?.user?.id, workoutSessions, menus, templates]);
  
  return (
    <div>syncTest</div>
  )
}

export default syncTest