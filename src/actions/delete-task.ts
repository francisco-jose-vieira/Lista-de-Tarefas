"use server"
import { prisma } from "@/utils/prisma";  
export const deleteTaskFromDb = async (id: string) => {
  try {
    if(!id) return
    const deletedTask = await prisma.tasks.delete({
      where: {
        id: id
      }
    })

    if (!deletedTask) return
    return deletedTask;
  } catch (error) {
    throw error
  }
}