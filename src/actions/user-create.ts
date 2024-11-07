"use server"

import { prismaDb } from "@/lib/db"
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

//TODO? menu邏輯
export const upsertMenu = async (data: MenuType) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // todo* 方式一 create與 update: 判斷 data 中有包含 id, 為更新操作
  if (data.id) {
    const updatedMenu = await prismaDb.menu.update({
      where: { id: data.id },
      data: {
        title: data.title
      }
    });

    revalidatePath('/fit')

    return {
      id: updatedMenu.id,
      userId: updatedMenu.userId,
      title: updatedMenu.title
    } as MenuType;
  }

  // 新建操作
  const newMenu = await prismaDb.menu.create({
    data: {
      userId: data.userId,
      title: data.title
    }
  });

  revalidatePath('/fit')

  return {
    id: newMenu.id,
    userId: newMenu.userId,
    title: newMenu.title
  } as MenuType;

  // todo* 方式二 upsert
  // const updatedMenu = await prismaDb.menu.upsert({
  //   where: { id: data.id },
  //   update: {
  //     title: data.title
  //   },
  //   create: {
  //     userId: userId,
  //     title: data.title
  //   }
  // });

  // return {
  //   id: updatedMenu.id,
  //   userId: updatedMenu.userId,
  //   title: updatedMenu.title
  // } as MenuType;
}

export const getAllMenusByUserId = async (id?: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return [];
  }

  const menus = await prismaDb.menu.findMany({
    where: { userId: id }
  })

  revalidatePath('/fit')
  return menus
}

export const getMenuById = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const menu = await prismaDb.menu.findUnique({
    where: { id: id }
  })

  return menu
}

export const deleteMenuById = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const menus = await prismaDb.menu.delete({
    where: {
      id: id,
      userId: userId
    }
  })

  revalidatePath('/fit')
  return menus
}

//TODO? 模板邏輯
export const upsertTemplate = async (data: TemplateType) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 檢查是否有 templateId 來判斷是更新還是創建
  if (data.templateId) {
    const updatedTemplate = await prismaDb.template.update({
      where: {
        id: data.templateId
      },
      data: {
        templateTitle: data.templateTitle,
        templateCategory: data.templateCategory,
        exercises: {
          deleteMany: {},
          create: data.exercises.map((exercise) => ({
            movementId: exercise.movementId,
            name: exercise.name,
            exerciseCategory: exercise.exerciseCategory,
            sets: {
              create: exercise.sets.map((set) => ({
                leftWeight: set.leftWeight,
                rightWeight: set.rightWeight,
                repetitions: set.repetitions,
                totalWeight: set.totalWeight,
                movementId: exercise.movementId,
              })),
            },
            refWorkoutSessionId: null,
          })) as Prisma.ExerciseUncheckedCreateWithoutTemplateInput[],
        }
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });

    revalidatePath('/fit')
    return updatedTemplate;
  }

  // 創建新模板
  const newTemplate = await prismaDb.template.create({
    data: {
      menuId: data.menuId,
      templateTitle: data.templateTitle,
      templateCategory: data.templateCategory,
      exercises: {
        create: data.exercises.map((exercise) => ({
          movementId: exercise.movementId,
          name: exercise.name,
          exerciseCategory: exercise.exerciseCategory,
          sets: {
            create: exercise.sets.map((set) => ({
              leftWeight: set.leftWeight,
              rightWeight: set.rightWeight,
              repetitions: set.repetitions,
              totalWeight: set.totalWeight,
              movementId: exercise.movementId,
            })),
          },
          refWorkoutSessionId: null,
        })) as Prisma.ExerciseUncheckedCreateWithoutTemplateInput[],
      }
    },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });

  revalidatePath('/fit')
  return newTemplate;
};

export const upsertExercise = async (exercises: ExerciseType[], templateId: string, workoutSessionId: string | null) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Step 1: 獲取該模板下的現有運動項目
  const existingExercises = await prismaDb.exercise.findMany({
    where: { templateId }
  });
  // Step 2: 找出需要保留的運動 movementId 列表
  const selectedMovementIds = exercises.map(exercise => exercise.movementId);
  // Step 3: 找出需要刪除的運動項目
  const exercisesToDelete = existingExercises.filter(exercise => !selectedMovementIds.includes(exercise.movementId));
  // Step 4: 刪除需要刪除的運動項目
  await Promise.all(exercisesToDelete.map(async (exercise) => {
    await prismaDb.exercise.delete({
      where: { id: exercise.id },
    });
  }));

  // 插入或更新項目
  const updatedExercises = await Promise.all(exercises.map(async (exercise) => {
    const { movementId, name, sets, exerciseCategory } = exercise;

    const existingExercise = await prismaDb.exercise.findFirst({
      where: { movementId, templateId },
    });

    if (existingExercise) {
      return await prismaDb.exercise.update({
        where: { id: existingExercise.id },
        data: {
          name,
          movementId,
          exerciseCategory,
          sets: {
            upsert: sets.map(set => ({
              where: { id: set.id },
              create: {
                movementId: exercise.movementId,
                leftWeight: set.leftWeight,
                rightWeight: set.rightWeight,
                repetitions: set.repetitions,
                totalWeight: set.totalWeight,
              },
              update: {
                leftWeight: set.leftWeight,
                rightWeight: set.rightWeight,
                repetitions: set.repetitions,
                totalWeight: set.totalWeight,
              }
            })),
          },
        },
        include: {
          sets: true
        }
      });
    } else {
      return await prismaDb.exercise.create({
        data: {
          name,
          movementId,
          exerciseCategory,
          template: { connect: { id: templateId } },
          ...(workoutSessionId ? { workoutSession: { connect: { id: workoutSessionId } } } : {}),
          sets: {
            create: sets.map(set => ({
              movementId: exercise.movementId,
              leftWeight: set.leftWeight,
              rightWeight: set.rightWeight,
              repetitions: set.repetitions,
              totalWeight: set.totalWeight,
            })),
          },
        },
        include: {
          sets: true,
        }
      });
    }
  }));

  revalidatePath('/fit');
  return updatedExercises;
};

export const getAllTemplatesByUserId = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  const templates = await prismaDb.template.findMany({
    where: { isDeleted: false },
    include: {
      menu: true,
      exercises: {
        include: {
          sets: true,
        },
      },
    }
  });

  return templates.map(template => ({
    ...template,
    userId: template.menu.userId
  }));
}

export const getTemplateById = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const template = await prismaDb.template.findUnique({
    where: {
      id: id,
    },
    include: {
      exercises: {
        include: {
          sets: true
        }
      }
    }
  })

  return template
}

export const getExerciseByTemplateId = async (templateId: string) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  const exercises = await prismaDb.exercise.findMany({
    where: {
      templateId: templateId
    },
    include: {
      sets: true
    }
  });

  return exercises
}

export const deleteTemplateById = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const template = await prismaDb.template.delete({
    where: {
      id: id,
    }
  })

  revalidatePath('/fit')
  return template
}
