// import React, { useState, useEffect, useRef } from 'react';
// import TemplateCard from './TemplateCard';
// import { TemplateType } from '../fit/[menuId]/[templateId]/TemplateForm';

// const CategoryIcons: { [key: string]: string } = {
//   "胸": "",
//   "背": "/icons/back.svg",
//   "肩": "/icons/shoulder.svg",
//   "腿": "/icons/leg.svg",
//   "二頭": "",
//   "三頭": "",
// };

// type TemplateCardListProps = {
//   selectedTemplates: TemplateType[];
//   handleRemoveTemplate: (menuId: string) => void;
// };

// const TemplateCardList = ({ selectedTemplates, handleRemoveTemplate }: TemplateCardListProps) => {
//   const [templates, setTemplates] = useState<TemplateType[]>([]);
//   const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
//   const [touchY, setTouchY] = useState<number | null>(null);
//   const templateRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const isDragging = useRef(false);

//   useEffect(() => {
//     setTemplates(selectedTemplates);
//   }, [selectedTemplates]);

//   const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
//     isDragging.current = true;
//     event.dataTransfer.setData('text/plain', index.toString());
//   };

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
//     event.preventDefault();
//     const draggedIdx = parseInt(event.dataTransfer.getData('text/plain'));
//     handleReorder(draggedIdx, index);
//     isDragging.current = false;
//   };

//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//   };

//   const handleDragEnd = () => {
//     isDragging.current = false;
//   };

//   const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
//     setDraggedIndex(index);
//     setTouchY(event.touches[0].clientY);
//     isDragging.current = true;
//   };
  
//   const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
//     if (draggedIndex === null || touchY === null) return;

//     const currentY = event.touches[0].clientY;
//     const deltaY = currentY - touchY;

//     if (Math.abs(deltaY) > 20) {
//       const currentIndex = Math.floor((currentY - 60) / 80);
//       if (currentIndex >= 0 && currentIndex < templates.length && currentIndex !== draggedIndex) {
//         handleReorder(draggedIndex, currentIndex);
//         setDraggedIndex(currentIndex);
//         setTouchY(currentY);
//       }
//     }
//   };
  
//   const handleTouchEnd = () => {
//     setDraggedIndex(null);
//     setTouchY(null);
//     isDragging.current = false;
//   };

//   const handleReorder = (fromIndex: number, toIndex: number) => {
//     const updatedTemplates = [...templates];
//     const [draggedTemplate] = updatedTemplates.splice(fromIndex, 1);
//     updatedTemplates.splice(toIndex, 0, draggedTemplate);
//     setTemplates(updatedTemplates);
//   };

//   const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     if (isDragging.current) {
//       event.preventDefault();
//       event.stopPropagation();
//     } else {
//       // 正常的點擊事件處理
//     }
//   };

//   return (
//     <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3 relative'>
//       {templates.length > 0 ? (
//         templates.map((work, index) => (
//           <div
//             key={work.cardId}
//             ref={(el: HTMLDivElement | null) => {
//               templateRefs.current[index] = el;
//             }}
//             draggable
//             onDragStart={(event) => handleDragStart(event, index)}
//             onDrop={(event) => handleDrop(event, index)}
//             onDragOver={handleDragOver}
//             onDragEnd={handleDragEnd}
//             onTouchStart={(event) => handleTouchStart(event, index)}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//             onClick={(event) => handleClick(event)}
//             style={{
//               transition: 'transform 0.2s',
//               transform: draggedIndex === index ? 'scale(1.05)' : 'scale(1)',
//             }}
//           >
//             <TemplateCard
//               iconSrc={CategoryIcons[work.category] || "/icons/dumbbell.svg"}
//               category={work.category}
//               title={work.title}
//               onRemove={() => handleRemoveTemplate(work.cardId)}
//               menuId={work.menuId}
//               templateId={work.cardId}
//               exercises={work.exercises}
//             />
//           </div>
//         ))
//       ) : (
//         <div className='flex justify-center items-center w-40 h-20 border p-2 border-dashed border-black rounded-lg'>
//           <p className='font-bold capitalize text-sm text-wrap'>
//             訓練模板
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TemplateCardList;



//TODO: 編輯訓練卡, 沒拿到資料先用這個
  // useEffect(() => {
  //   if ('sessionId' in template) {
  //     setCurrentSession(template as WorkoutSessionType);
  //   } else {
  //     setCurrentSession({
  //       sessionId: new Date().getTime().toString(),
  //       userId: template.userId || 'Guest',
  //       menuId: template.menuId,
  //       templateId: template.templateId,
  //       templateTitle: template.templateTitle,
  //       date: new Date().toISOString().slice(0, 10),
  //       exercises: JSON.parse(JSON.stringify(template.exercises))
  //     } as WorkoutSessionType);
  //   }
  // }, [template]);


// "use client"

// import { useEffect, useState } from "react";
// import ExerciseListCard from '../../../[menuId]/[templateId]/ExerciseListCard';
// import { useUserStore } from "@/lib/store";

// type TemplateProps = {
//   template: TemplateType
// }

// const StartWorkout = ({ template }: TemplateProps) => {
//   const user = useUserStore(state => state.user.userId);

//   // TODO: 不改變原始模板template, 很多是固定屬性, 用戶可編輯exercises, 所以只需要拷貝exercises
//   const [workoutSession, setWorkoutSession] = useState<WorkoutSessionType | null>(null);
//   console.log('查看', workoutSession)

//   useEffect(() => {
//     if (!workoutSession && template.menuId && template.cardId) {
//       const newSession = {
//         sessionId: Date.now().toString(),
//         userId: user,
//         menuId: template.menuId,
//         templateId: template.cardId,
//         date: new Date().toISOString().slice(0, 10),
//         exercises: JSON.parse(JSON.stringify(template.exercises)),
//       };
//       setWorkoutSession(newSession);
//     }
//   }, [template, user, workoutSession, setWorkoutSession]);

//   // 點擊動作卡片, 打開動作的組數設定
//   const [openExerciseId, setOpenExerciseId] = useState<string | null>(null);
//   const handleToggleExercise = (exerciseId: string) => {
//     setOpenExerciseId((prev) => (prev === exerciseId ? null : exerciseId));
//   };

//   // 編輯重量、組數等
//   const handleUpdateSets = (exerciseId: string, updatedSets: SetType[]) => {
//     setWorkoutSession((prev) => {
//       if (!prev) return null;
//       const updatedExercises = prev.exercises.map((exercise) =>
//         exercise.exerciseId === exerciseId
//           ? { ...exercise, sets: updatedSets }
//           : exercise
//       );
//       // 更新組數設定
//       const updatedSession = { ...prev, exercises: updatedExercises };

//       return updatedSession;
//     });
//   };

//   // 刪除動作
//   const handleRemoveExercise = (exerciseId: string) => {
//     setWorkoutSession((prev) => {
//       if (!prev) return null;
//       const updatedExercises = prev.exercises.filter(
//         (exercise) => exercise.exerciseId !== exerciseId
//       );
//       // 更新刪除後的儲存
//       return { ...prev, exercises: updatedExercises };
//     });
//   };

//   return (
//     <div className="sm:py-10">
//       <div>
//         {/* TOP UI  */}
//       </div>

//       <div className='mt-3 px-3 rounded-t-2xl sm:rounded-2xl bg-slate-200'>
//         <div className='pt-3'>
//           <div className='overflow-y-scroll max-h-[500px] min-h-[500px]'>
//             <div className='flex flex-col gap-3 pb-20'>
//               {workoutSession?.exercises.map((exercise) => (
//                 <ExerciseListCard
//                   key={exercise.exerciseId}
//                   exercise={exercise}
//                   handleRemoveExercise={handleRemoveExercise}
//                   onUpdateSets={handleUpdateSets}
//                   isOpen={openExerciseId === exercise.exerciseId}
//                   onToggle={() => handleToggleExercise(exercise.exerciseId)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default StartWorkout