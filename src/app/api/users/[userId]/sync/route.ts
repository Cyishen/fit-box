// import { prismaDb } from "@/lib/db";
// import { NextResponse } from "next/server";



// export const POST = async (req: Request) => {
//   try {
//     const { userId, workoutSessions, menus, templates } = await req.json();

//     const user = await prismaDb.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const menuSave = await Promise.all(
//       menus.map(async (menu: MenuType) => {
//         return await prismaDb.menu.upsert({
//           where: {
//             id: menu.id
//           },
//           create: {
//             id: menu.id,
//             userId: userId,
//             title: menu.title || "新訓練盒🥚"
//           },
//           update: {
//             id: menu.id,
//             userId: userId,
//             title: menu.title || "新訓練盒🥚"
//           }
//         })
//       })
//     );

//     const templateSave = await Promise.all(
//       templates.map(async (template: TemplateType) => {
//         return await prismaDb.$transaction(async (tx) => {
//           await tx.template.upsert({
//             where: {
//               id: template.id ?? '',
//             },
//             create: {
//               id: template.id ?? '',
//               templateTitle: template.templateTitle || "新模板",
//               templateCategory: template.templateCategory,
//               menuId: template.menuId
//             },
//             update: {
//               id: template.id ?? '',
//               templateTitle: template.templateTitle || "新模板",
//               templateCategory: template.templateCategory,
//               menuId: template.menuId
//             }
//           })
//         });
//       }),
//     );

//     const workSessionSave = await Promise.all(
//       workoutSessions.map(async (session: WorkoutSessionType) => {
//         return await prismaDb.$transaction(async (tx) => {
//           // 1. 創建或更新 WorkoutSession，確保包含所有欄位
//           const workoutSession = await tx.workoutSession.upsert({
//             where: {
//               cardSessionId: session.cardSessionId,
//             },
//             create: {
//               cardSessionId: session.cardSessionId,
//               userId: userId,
//               menuId: session.menuId,
//               templateId: session.templateId,
//               templateTitle: session.templateTitle,
//               date: new Date(session.date)
//             },
//             update: {
//               userId: userId,
//               cardSessionId: session.cardSessionId,
//               menuId: session.menuId,
//               templateId: session.templateId,
//               templateTitle: session.templateTitle,
//               date: new Date(session.date),
//             },
//             // 確保返回所有欄位
//             select: {
//               id: true,
//               cardSessionId: true,
//               userId: true,
//               menuId: true,
//               templateId: true,
//               templateTitle: true,
//               date: true,
//               startTime: true,
//               endTime: true,
//               notes: true,
//               exercises: {
//                 include: {
//                   sets: true,
//                 },
//               },
//             },
//           });

//           //TODO 統計
//           const totalSessionSets = session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
//           const totalSessionWeight = session.exercises.reduce(
//             (sum, exercise) =>
//               sum + exercise.sets.reduce((setSum, set) => setSum + set.totalWeight, 0), 0 );

//           const workoutSummary = await tx.workoutSummary.upsert({
//             where: { workoutSessionId: workoutSession.id },
//             create: {
//               workoutSessionId: workoutSession.id,
//               userId: workoutSession.userId,
//               totalSessionSets,
//               totalSessionWeight,
//               date: workoutSession.date
//             },
//             update: {
//               totalSessionSets,
//               totalSessionWeight
//             },
//           });

//           const exercisesSummary = await Promise.all(session.exercises.map(async (exercise) => {
//             const movementSets = exercise.sets.length;
//             const movementWeight = exercise.sets.reduce((sum, set) => sum + set.totalWeight, 0);

//             return await tx.exerciseSummary.upsert({
//               where: {
//                 movementId_workoutSummaryId: {
//                   movementId: exercise.movementId,
//                   workoutSummaryId: workoutSummary.id
//                 },
//               },
//               create: {
//                 movementId: exercise.movementId,
//                 movementName: exercise.name,
//                 movementSets: movementSets,
//                 movementWeight: movementWeight,
//                 workoutSummaryId: workoutSummary.id,
//               },
//               update: {
//                 movementSets: movementSets,
//                 movementWeight: movementWeight
//               },
//             });
//           }));

//           // 2. 用戶更新訓練卡, 先刪除 workoutSession模型的 exercises欄位內的所有資料
//           await tx.workoutExercise.deleteMany({
//             where: {
//               workoutSessionId: workoutSession.id
//             },
//           });

//           // 3. 創建新的 exercises 和 sets
//           const exercises = await Promise.all(
//             session.exercises.map(async (exercise) => {
//               return await tx.workoutExercise.create({
//                 data: {
//                   movementId: exercise.movementId,
//                   name: exercise.name,
//                   exerciseCategory: exercise.exerciseCategory,
//                   workoutSessionId: workoutSession.id,
//                   sets: {
//                     create: exercise.sets.map((set) => ({
//                       leftWeight: parseFloat(set.leftWeight.toString()),
//                       rightWeight: parseFloat(set.rightWeight.toString()),
//                       repetitions: parseInt(set.repetitions.toString()),
//                       totalWeight: parseFloat(set.totalWeight.toString()),
//                       movementId: exercise.movementId,
//                     })),
//                   },
//                 },
//                 include: {
//                   sets: true,
//                 },
//               });
//             })
//           );

//           return {
//             ...workoutSession,
//             workoutSummary,
//             exercisesSummary,
//             exercises,
//           };
//         });
//       }),
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Workout sessions synced successfully",
//       data: workSessionSave, menuSave, templateSave
//     });

//   } catch (error) {
//     console.error("Error syncing workout sessions:", error);
//     return NextResponse.json(
//       { error: "Failed to sync workout sessions" },
//       { status: 500 }
//     );
//   }
// };