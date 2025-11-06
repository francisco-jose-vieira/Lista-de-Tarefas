"use server";
import { prisma } from "@/utils/prisma";

export const getTasksFromDb = async () => {
  try {
    const tasks = await prisma.tasks.findMany();
    if (!tasks) {
      return null;
    }
    console.log(tasks);
    return tasks;
    
  } catch (error) {
    throw error
  }
};
