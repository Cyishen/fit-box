import { prismaDb } from "@/lib/db";
import { NextResponse } from "next/server";

// 類型定義
type SetType = {
  leftWeight: string | number;
  rightWeight: string | number;
  repetitions: string | number;
  totalWeight: number;
  movementId?: string;
};

type ExerciseType = {
  movementId: string;
  name: string;
  sets: SetType[];
  exerciseCategory?: string
};

type WorkoutSessionType = {
  cardSessionId: string;
  userId: string;
  menuId: string;
  templateId: string;
  templateTitle: string;
  date: string;
  exercises: ExerciseType[];
};

export const POST = async (req: Request) => {
  try {
    const { userId, workoutSessions } = await req.json();

    const user = await prismaDb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const results = await Promise.all(
      workoutSessions.map(async (session: WorkoutSessionType) => {
        return await prismaDb.$transaction(async (tx) => {
          // 1. 創建或更新 WorkoutSession，確保包含所有欄位
          const workoutSession = await tx.workoutSession.upsert({
            where: {
              cardSessionId: session.cardSessionId,
            },
            create: {
              cardSessionId: session.cardSessionId,
              userId: userId,
              menuId: session.menuId,
              templateId: session.templateId,
              templateTitle: session.templateTitle,
              date: new Date(session.date),
            },
            update: {
              menuId: session.menuId,
              templateId: session.templateId,
              templateTitle: session.templateTitle,
              date: new Date(session.date),
            },
            // 確保返回所有欄位
            select: {
              id: true,
              cardSessionId: true,
              userId: true,
              menuId: true,
              templateId: true,
              templateTitle: true,
              date: true,
              startTime: true,
              endTime: true,
              notes: true,
            },
          });

          // 2. 刪除 workoutSession模型的 exercises欄位內的所有資料
          await tx.exercise.deleteMany({
            where: {
              refWorkoutSessionId: workoutSession.id
            },
          });

          // 3. 創建新的 exercises 和 sets
          const exercises = await Promise.all(
            session.exercises.map(async (exercise) => {
              return await tx.exercise.create({
                data: {
                  movementId: exercise.movementId,
                  name: exercise.name,
                  workoutSession: {
                    connect: {
                      cardSessionId: session.cardSessionId,
                    },
                  },
                  sets: {
                    create: exercise.sets.map((set) => ({
                      leftWeight: parseFloat(set.leftWeight.toString()),
                      rightWeight: parseFloat(set.rightWeight.toString()),
                      repetitions: parseInt(set.repetitions.toString()),
                      totalWeight: parseFloat(set.totalWeight.toString()),
                      movementId: exercise.movementId,
                    })),
                  },
                },
                include: {
                  sets: true,
                },
              });
            })
          );

          // 4. 返回完整的訓練記錄數據
          return {
            ...workoutSession,
            exercises,
          };
        });
      })
    );

    return NextResponse.json({ 
      success: true, 
      message: "Workout sessions synced successfully",
      data: results 
    });

  } catch (error) {
    console.error("Error syncing workout sessions:", error);
    return NextResponse.json(
      { error: "Failed to sync workout sessions" },
      { status: 500 }
    );
  }
};