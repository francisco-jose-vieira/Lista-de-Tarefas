"use server"
import { prisma } from "@/utils/prisma";

export const editedTask = async (idTask: string, newTask: string) => {
  try {
    if(!idTask || !newTask) return
    const updatedTask = await prisma.tasks.update({
      where: {id: idTask},
      data: {task: newTask}
    })

    if (!updatedTask) return
    return updatedTask;

  } catch (error) {
    throw error
  }
}