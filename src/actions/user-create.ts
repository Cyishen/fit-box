"use server"

import { prismaDb } from "@/lib/db"
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// import { Prisma } from "@prisma/client";

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
      // userId: userId
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

  // 檢查是否有 id 來判斷是更新還是創建
  if (data.id) {
    const updatedTemplate = await prismaDb.template.update({
      where: {
        id: data.id
      },
      data: {
        templateTitle: data.templateTitle,
        templateCategory: data.templateCategory,
        templateExercises: {
          deleteMany: {},
          create: data.templateExercises.map((exercise) => ({
            sortOrder: Number(exercise.sortOrder),
            movementId: exercise.movementId,
            name: exercise.name,
            exerciseCategory: exercise.exerciseCategory,
            templateSets: {
              create: exercise.templateSets.map((set) => ({
                movementId: exercise.movementId,
                leftWeight: set.leftWeight,
                rightWeight: set.rightWeight,
                repetitions: set.repetitions,
                totalWeight: set.totalWeight,
              })),
            },
          })),
        }
      },
      include: {
        templateExercises: {
          include: {
            templateSets: true,
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
      templateExercises: {
        create: data.templateExercises.map((exercise) => ({
          sortOrder: Number(exercise.sortOrder),
          movementId: exercise.movementId,
          name: exercise.name,
          exerciseCategory: exercise.exerciseCategory,
          templateSets: {
            create: exercise.templateSets.map((set) => ({
              movementId: exercise.movementId,
              leftWeight: set.leftWeight,
              rightWeight: set.rightWeight,
              repetitions: set.repetitions,
              totalWeight: set.totalWeight,
            })),
          },
        })),
      }
    },
    include: {
      templateExercises: {
        include: {
          templateSets: true,
        },
      },
    },
  });

  revalidatePath('/fit')
  return newTemplate;
};

export const upsertExercise = async (exercises: TemplateExerciseType[], templateId: string) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Step 1: 獲取該模板下的現有運動項目
  const existingExercises = await prismaDb.templateExercise.findMany({
    where: { templateId }
  });
  // Step 2: 找出需要保留的運動 movementId 列表
  const selectedMovementIds = exercises.map(exercise => exercise.movementId);
  // Step 3: 找出需要刪除的運動項目
  const exercisesToDelete = existingExercises.filter(exercise => !selectedMovementIds.includes(exercise.movementId));
  // Step 4: 刪除需要刪除的運動項目
  await Promise.all(exercisesToDelete.map(async (exercise) => {
    await prismaDb.templateExercise.delete({
      where: { id: exercise.id },
    });
  }));

  // 插入或更新項目
  const updatedExercises = await Promise.all(exercises.map(async (exercise) => {
    const { movementId, name, templateSets, exerciseCategory } = exercise;

    const existingExercise = await prismaDb.templateExercise.findFirst({
      where: { movementId, templateId },
    });

    if (existingExercise) {
      return await prismaDb.templateExercise.update({
        where: { id: existingExercise.id },
        data: {
          sortOrder: Number(exercise.sortOrder),
          name,
          movementId,
          exerciseCategory,
          templateSets: {
            upsert: templateSets.map(set => ({
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
          templateSets: true
        }
      });
    } else {
      return await prismaDb.templateExercise.create({
        data: {
          sortOrder: Number(exercise.sortOrder),
          name,
          movementId,
          exerciseCategory,
          template: { connect: { id: templateId } },
          templateSets: {
            create: templateSets.map(set => ({
              movementId: exercise.movementId,
              leftWeight: set.leftWeight,
              rightWeight: set.rightWeight,
              repetitions: set.repetitions,
              totalWeight: set.totalWeight,
            })),
          },
        },
        include: {
          templateSets: true,
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
    where: {
      isDeleted: false 
    },
    include: {
      menu: true,
      templateExercises: {
        include: {
          templateSets: true,
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
      templateExercises: {
        include: {
          templateSets: true
        }
      }
    }
  })

  return template
}

export const getTemplateByMenuId = async (menuId: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const menuTemplate = await prismaDb.template.findMany({
    where: {
      menuId: menuId,
    },
  })

  return menuTemplate
}

export const getTemplateExerciseByTemplateId = async (templateId: string) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  const exercises = await prismaDb.templateExercise.findMany({
    where: {
      templateId: templateId,
    },
    include: {
      templateSets: true
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

//TODO? 訓練卡邏輯
export const upsertWorkoutSession = async (data: WorkoutSessionType) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 檢查是否有 id 來判斷是更新還是創建
  if (data.id) {
    const updatedWorkoutSession = await prismaDb.workoutSession.update({
      where: { id: data.id },
      data: {
        ...data,
        date: new Date(data.date).toISOString(),
        exercises: {
          deleteMany: {},
          create: data.exercises.map((exercise) => ({
            id: exercise.id,
            movementId: exercise.movementId,
            name: exercise.name,
            exerciseCategory: exercise.exerciseCategory,
            // template: { 
            //   connect: { id: data.templateId } 
            // },
            sets: {
              create: exercise.sets.map((set) => ({
                movementId: exercise.movementId,
                leftWeight: set.leftWeight,
                rightWeight: set.rightWeight,
                repetitions: set.repetitions,
                totalWeight: set.totalWeight,
                isCompleted: set.isCompleted,
              })),
            },
          })),
        },
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    });
    revalidatePath('/fit');
    return updatedWorkoutSession;
  }

  // 1. 首先創建 WorkoutSession
  try {
    const newWorkoutSession = await prismaDb.workoutSession.create({
      data: {
        cardSessionId: data.cardSessionId,
        userId: userId,
        menuId: data.menuId,
        templateId: data.templateId,
        templateTitle: data.templateTitle,
        date: new Date(data.date).toISOString(),
      },
    });

    // 2. 為新的 WorkoutSession 創建exercises和sets
    const exercisePromises = data.exercises.map(async (exercise) => {
      // 創建新的 Exercise 記錄，與原模板無關聯
      return await prismaDb.workoutExercise.create({
        data: {
          movementId: exercise.movementId,
          name: exercise.name,
          exerciseCategory: exercise.exerciseCategory,
          workoutSessionId: newWorkoutSession.id, // 關聯到新的訓練卡
          sets: {
            create: exercise.sets.map((set) => ({
              movementId: exercise.movementId,
              leftWeight: set.leftWeight,
              rightWeight: set.rightWeight,
              repetitions: set.repetitions,
              totalWeight: set.totalWeight,
              isCompleted: set.isCompleted,
            })),
          },
        },
        include: {
          sets: true,
        },
      });
    });

    // 等待所有 exercises 創建完成
    await Promise.all(exercisePromises);

    // 3. 返回完整的訓練卡數據
    const completeWorkoutSession = await prismaDb.workoutSession.findUnique({
      where: {
        id: newWorkoutSession.id,
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });

    revalidatePath('/fit');
    return completeWorkoutSession;
  } catch (error) {
    console.error("Error creating workout session:", error);
    throw error;
  }
}

export const getWorkoutSessionByCardId = async (cardSessionId: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const getWorkoutSession = await prismaDb.workoutSession.findFirst({
    where: {
      cardSessionId: cardSessionId,
      userId: userId
    },
    include: {
      exercises: {
        include: {
          sets: true
        }
      }
    }
  })

  if (getWorkoutSession) {
    return {
      ...getWorkoutSession,
      date: getWorkoutSession.date.toISOString().slice(0, 10),
      startTime: getWorkoutSession.startTime ? getWorkoutSession.startTime.toISOString() : null,
      endTime: getWorkoutSession.endTime ? getWorkoutSession.endTime.toISOString() : null,
      createdAt: getWorkoutSession.createdAt.toISOString(),
    };
  }

  return null;
}

export const getAllWorkoutSessionByUserId = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return []
  }

  const getWorkoutSession = await prismaDb.workoutSession.findMany({
    where: {
      userId: id
    },
    include: {
      exercises: {
        include: {
          sets: true
        }
      }
    }
  })

  const formattedSessions = getWorkoutSession.map(session => ({
    ...session,
    date: session.date.toISOString().slice(0, 10),
    startTime: session.startTime ? session.startTime.toISOString() : null,
    endTime: session.endTime ? session.endTime.toISOString() : null,
    createdAt: session.createdAt.toISOString(),
  }));

  revalidatePath('/fit');
  revalidatePath('/profile');
  return formattedSessions;
}

export const deleteWorkoutSessionByCardId = async (cardSessionId: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workSession = await prismaDb.workoutSession.delete({
    where: {
      cardSessionId: cardSessionId,
    }
  })

  revalidatePath('/fit')
  return workSession
}

//TODO* 訓練卡其他調用邏輯
export const getFirstWorkoutSessionDay = async () => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null;
  } 

  const firstTraining = await prismaDb.workoutSession.findFirst({
    where: { 
      userId: userId
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return firstTraining
}

export const getDaySessionByUserId = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return []
  }

  // 本地時間
  const now = new Date();
  const startOfLocalDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfLocalDay = new Date(now.setHours(23, 59, 59, 999));

  // 資料庫是UTC時間, 要把本地時間轉為UTC
  const startOfDayUTC = new Date(startOfLocalDay.getTime() - startOfLocalDay.getTimezoneOffset() * 60000); 
  const endOfDayUTC = new Date(endOfLocalDay.getTime() - endOfLocalDay.getTimezoneOffset() * 60000);

  const getWorkoutSession = await prismaDb.workoutSession.findMany({
    where: {
      userId: id,
      createdAt: {
        gte: startOfDayUTC,
        lte: endOfDayUTC
      }
    },
    include: {
      exercises: {
        include: {
          sets: true
        }
      }
    }
  });

  const formattedSessions = getWorkoutSession.map(session => {
    const utcDate = new Date(session.createdAt);
    const localDate = utcDate.toISOString();
    // const localDate = formatDateString(utcDate.toISOString());
    
    return {
      ...session,
      createdAt: localDate,
    };
  });

  revalidatePath('/fit');
  return formattedSessions;
}


