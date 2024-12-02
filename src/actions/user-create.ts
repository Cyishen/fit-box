"use server"

import { prismaDb } from "@/lib/db"
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getDateRange } from "@/lib/TimeFn/Timer";

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

export const getAllMenusByUserId = async (id: string) => {
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

  // 1. 檢查是否有 id 來判斷是更新還是創建
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
    // revalidatePath('/fit');
    return updatedWorkoutSession;
  }

  // 2. 用upsert創建 WorkoutSession  
  try {
    const workoutSession = await prismaDb.workoutSession.upsert({
      where: {
        cardSessionId: data.cardSessionId,
      },
      update: {
        // 更新資料
        menuId: data.menuId,
        templateId: data.templateId,
        templateTitle: data.templateTitle,
        date: new Date(data.date).toISOString(),
        exercises: {
          upsert: data.exercises.map((exercise) => ({
            where: { id: exercise.id ?? '' },
            create: {
              movementId: exercise.movementId,
              name: exercise.name,
              exerciseCategory: exercise.exerciseCategory,
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
            update: {
              name: exercise.name, // 已有動作進行更新
              exerciseCategory: exercise.exerciseCategory,
              sets: {
                deleteMany: {}, // 刪除舊的組數數據，重新創建新的
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
          })),
          deleteMany: {
            id: {
              notIn: data.exercises.map((e) => e.id).filter((id) => id !== undefined),
            },
          },
        },
      },
      create: {
        // 創建新資料
        cardSessionId: data.cardSessionId,
        userId: data.userId,
        menuId: data.menuId,
        templateId: data.templateId,
        templateTitle: data.templateTitle,
        date: new Date(data.date).toISOString(),
        exercises: {
          create: data.exercises.map((exercise) => ({
            movementId: exercise.movementId,
            name: exercise.name,
            exerciseCategory: exercise.exerciseCategory,
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
            sets: true,
          },
        },
      },
    });
    // revalidatePath('/fit');
    return workoutSession;
  } catch (error) {
    console.error("Error creating workout session:", error);
    throw error;
  }
}

export const updateDayCardToDb = async (data: WorkoutSessionType[]) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const updatedWorkoutSessions = await Promise.all(
      data.map(async (sessionData) => {
        return prismaDb.workoutSession.update({
          where: {
            id: sessionData.id,
          },
          data: {
            menuId: sessionData.menuId,
            templateId: sessionData.templateId,
            templateTitle: sessionData.templateTitle,
            date: new Date(sessionData.date).toISOString(),
            exercises: {
              update: sessionData.exercises.map((exercise) => ({
                where: { id: exercise.id ?? "" }, // 更新指定的 exercise
                data: {
                  name: exercise.name,
                  exerciseCategory: exercise.exerciseCategory,
                  sets: {
                    update: exercise.sets.map((set) => ({
                      where: { id: set.id ?? "" },
                      data: {
                        leftWeight: set.leftWeight,
                        rightWeight: set.rightWeight,
                        repetitions: set.repetitions,
                        totalWeight: set.totalWeight,
                        isCompleted: set.isCompleted,
                      },
                    })),
                  },
                },
              })),
            },
          },
        });
      })
    );

    revalidatePath('/fit');
    return updatedWorkoutSessions;
  } catch (error) {
    console.error("Error updating workout sessions:", error);
    throw error;
  }
};


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

//TODO! 抓所有訓練卡
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

  // 按照日期進行排序
  const sortedSummaries = getWorkoutSession.sort((a, b) => b.date.getTime() - a.date.getTime());

  const formattedSessions = sortedSummaries.map(session => ({
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

//TODO? 訓練卡其他調用邏輯
// 第一天
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
// 當天訓練卡
export const getDaySessionByUserId = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return []
  }

  // 本地時間範圍
  const now = new Date();
  const startOfLocalDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfLocalDay = new Date(now.setHours(23, 59, 59, 999));

  // 資料庫是UTC時間, 要把本地時間範圍 >轉對應的UTC範圍
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

  // 按照日期進行排序
  const sortedSummaries = getWorkoutSession.sort((a, b) => a.date.getTime() - b.date.getTime());

  const formattedSessions = sortedSummaries.map(session => {
    const utcDate = new Date(session.createdAt);
    const localDate = utcDate.toISOString();

    return {
      ...session,
      createdAt: localDate,
    };
  });

  revalidatePath('/fit');
  return formattedSessions;
}
// 一週訓練卡
export const getWeekSessionByUserId = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return []
  }

  const now = new Date();
  
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7); 

  const startOfLocalWeek = new Date(oneWeekAgo.setHours(0, 0, 0, 0));
  const endOfLocalDay = new Date(now.setHours(23, 59, 59, 999));

  const startOfWeekUTC = new Date(startOfLocalWeek.getTime() - startOfLocalWeek.getTimezoneOffset() * 60000);
  const endOfDayUTC = new Date(endOfLocalDay.getTime() - endOfLocalDay.getTimezoneOffset() * 60000);

  const getWorkoutSession = await prismaDb.workoutSession.findMany({
    where: {
      userId: id,
      createdAt: {
        gte: startOfWeekUTC, 
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

  const sortedSessions = getWorkoutSession.sort((a, b) => b.date.getTime() - a.date.getTime());

  const formattedSessions = sortedSessions.map(session => {
    const utcDate = new Date(session.createdAt);
    const localDate = utcDate.toISOString();

    return {
      ...session,
      createdAt: localDate,
    };
  });

  revalidatePath('/fit');
  return formattedSessions;
}


//TODO? 統計邏輯
export const upsertWorkoutSummary = async (id: string) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 獲取當前訓練卡及相關數據
  const workoutSession = await prismaDb.workoutSession.findUnique({
    where: { id: id },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });

  if (!workoutSession) {
    throw new Error("Workout session not found");
  }

  // 初始值
  let totalSessionSets = 0;
  let totalSessionWeight = 0;

  // 計算每個動作的數據
  const exerciseSummaries = workoutSession.exercises
    .filter((exercise) =>
      exercise.sets.some((set) => set.isCompleted)
    )
    .map((exercise) => {
      const completedSets = exercise.sets.filter((set) => set.isCompleted);
      const movementSets = completedSets.length;
      const movementWeight = completedSets.reduce((total, set) => total + set.totalWeight, 0);

      if (movementSets > 0) {
        totalSessionSets += movementSets;
        totalSessionWeight += movementWeight;

        return {
          movementId: exercise.movementId,
          movementName: exercise.name,
          movementSets,
          movementWeight,
        };
      }
      return null;
    })
    .filter((summary) => summary !== null);

  // 檢查訓練卡是否有數據
  if (totalSessionSets === 0) {
    await prismaDb.workoutSummary.deleteMany({
      where: { workoutSessionId: id },
    });
    return { totalSessionSets: 0, totalSessionWeight: 0 };
  }

  // TODO: 更新或創建 WorkoutSummary
  const workoutSummary = await prismaDb.workoutSummary.upsert({
    where: { workoutSessionId: id },
    update: {
      totalSessionSets,
      totalSessionWeight,
    },
    create: {
      userId,
      workoutSessionId: id,
      date: workoutSession.date,
      totalSessionSets,
      totalSessionWeight,
    },
  });

  // TODO: exercise數據
  // 第二步: 用戶修改訓練卡, 篩選目前有的動作
  const currentMovementIds = exerciseSummaries.map(e => e.movementId);
  await prismaDb.exerciseSummary.deleteMany({
    where: {
      workoutSummaryId: workoutSummary.id,
      NOT: { movementId: { in: currentMovementIds } },
    },
  });

  // 第三步: 更新或創建 ExerciseSummary
  const exerciseSummaryPromises = exerciseSummaries.map(async (summary) => {
    await prismaDb.exerciseSummary.upsert({
      where: {
        workoutSummaryId_movementId: {
          movementId: summary.movementId,
          workoutSummaryId: workoutSummary.id,
        },
      },
      update: {
        movementSets: summary.movementSets,
        movementWeight: summary.movementWeight,
      },
      create: {
        movementId: summary.movementId,
        movementName: summary.movementName,
        movementSets: summary.movementSets,
        movementWeight: summary.movementWeight,
        workoutSummaryId: workoutSummary.id,
      },
    });
  })
  // 等待exerciseSummaryPromises創建完成
  await Promise.all(exerciseSummaryPromises);


  // TODO: category數據
  // 第一步: 統計訓練卡中的每個類別
  const categorySummaries: {
    [key: string]: { totalCategorySets: number, totalCategoryWeight: number }
  } = {};

  workoutSession.exercises.forEach((exercise) => {
    const completedSets = exercise.sets.filter((set) => set.isCompleted);
    const movementSets = completedSets.length;
    const movementWeight = completedSets.reduce((total, set) => total + set.totalWeight, 0);

    const category = exercise.exerciseCategory;

    if (movementSets > 0) {
      if (!categorySummaries[category]) {
        categorySummaries[category] = { totalCategorySets: 0, totalCategoryWeight: 0 };
      }

      categorySummaries[category].totalCategorySets += movementSets;
      categorySummaries[category].totalCategoryWeight += movementWeight;
    }
  });

  // 第二步: 用戶修改訓練卡, 篩選目前有的動作, 排除改 "未完成"
  const currentCategories = workoutSession.exercises
    .filter((exercise) => exercise.sets.some((set) => set.isCompleted))
    .map((exercise) => exercise.exerciseCategory);
  // 刪除不在currentCategories的數據
  await prismaDb.exerciseCategorySummary.deleteMany({
    where: {
      workoutSummaryId: workoutSummary.id,
      NOT: { exerciseCategory: { in: currentCategories } },
    },
  });

  // 第三步: 更新或創建 ExerciseCategorySummary
  const exerciseCategorySummaryPromises = Object.keys(categorySummaries).map(async (category) => {
    const { totalCategorySets, totalCategoryWeight } = categorySummaries[category];

    if (totalCategorySets > 0) {
      await prismaDb.exerciseCategorySummary.upsert({
        where: {
          workoutSummaryId_exerciseCategory: {
            exerciseCategory: category,
            workoutSummaryId: workoutSummary.id,
          },
        },
        update: {
          totalCategorySets,
          totalCategoryWeight,
        },
        create: {
          exerciseCategory: category,
          totalCategorySets,
          totalCategoryWeight,
          workoutSummaryId: workoutSummary.id,
        },
      });
    }
  });

  // 等待exerciseCategorySummaryPromises創建完成
  await Promise.all(exerciseCategorySummaryPromises);

  return {
    totalSessionSets,
    totalSessionWeight,
  };
};

export const getCategorySummaryByUserIdForRange = async (id: string, range: 'week' | 'month' | 'year') => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  const startDate = new Date();
  const endDate = new Date();

  // const startOfDayUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
  // const endOfDayUTC = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

  switch (range) {
    case 'week':
      // 計算本週的開始和結束日期（週一作為週的開始）
      startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1);  // 本週的週一
      endDate.setDate(startDate.getDate() + 6);  // 本週的週日
      break;
    case 'month':
      startDate.setDate(1); // 當月的開始
      endDate.setMonth(endDate.getMonth() + 1); // 設置為下個月的第一天
      endDate.setDate(0); // 設置為當月的最後一天
      break;
    case 'year':
      startDate.setMonth(0, 1); // 當年的開始（1月1日）
      endDate.setMonth(11, 31); // 當年的結束（12月31日）
      break;
  }

  const workoutSummaries = await prismaDb.workoutSummary.findMany({
    where: {
      userId: id,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      categorySummaries: true,
    }
  });

  if (!workoutSummaries.length) {
    return [];
  }
  // 按照日期進行排序
  const sortedSummaries = workoutSummaries.sort((a, b) => a.date.getTime() - b.date.getTime());

  const formattedSessions = sortedSummaries.map(session => ({
    ...session,
    date: session.date.toISOString(),
  }));

  revalidatePath('/record');
  return formattedSessions;
};

// BarChart
export const getCategorySummaryByUserIdForBarChart = async (
  id: string,
  timeFrame: '週' | '月' | '年',
  isPrevious: boolean = false
) => {
  const { start, end } = getDateRange(timeFrame, new Date(), isPrevious);

console.log('開始',start);
console.log('結束',end);
  const workoutSummaries = await prismaDb.workoutSummary.findMany({
    where: {
      userId: id,
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      categorySummaries: true,
    },
  });

  if (!workoutSummaries.length) {
    return [];
  }

  // 按照日期進行排序
  const sortedSummaries = workoutSummaries.sort((a, b) => a.date.getTime() - b.date.getTime());

  const formattedSessions = sortedSummaries.map((session) => ({
    ...session,
    date: session.date.toISOString(),
  }));

  return formattedSessions;
};

