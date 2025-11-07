"use server";
import { prisma } from "@/utils/prisma";

export const toggleDone = async (id: string) => {
  try {
    const currentTask = await prisma.tasks.findUnique({
      where: { id },
    });

    if (!currentTask) return;

    const updatedTask = await prisma.tasks.update({
      where: { id },
      data: {
        done: !currentTask.done,
      },
    });

    if (!updatedTask) return;
    return updatedTask;
  } catch (error) {
    throw error;
  }
};
