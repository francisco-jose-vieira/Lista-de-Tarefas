"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ListCheck, LoaderCircle, Plus, Sigma, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EditTask } from '@/components/edit-task';
import { getTasksFromDb } from '@/actions/get-tasks-from-db';
import { useEffect, useMemo, useState } from 'react';
import { Tasks } from '@/generated/prisma/client';
import { addTasksFromDb } from '@/actions/add-tasks-from-db';
import { deleteTaskFromDb } from '@/actions/delete-task';
import { toggleDone } from '@/actions/toggle-done';
import { toast } from 'sonner';
import { Filter } from '@/components/filter';
import { deletecompletedTasks } from '@/actions/delete-completed-Tasks';


export default function Home() {
  const [taskList, setTaskList] = useState<Tasks[]>([]);
  const [task, setTask] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>("all");

  const handleGetTasks = async () => {
    try {
      const tasks = await getTasksFromDb();
      if (!tasks) return;
      setTaskList(tasks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleGetTasks();
    };

    fetchData();
  }, []);

  const filteredTasks = useMemo(() => {
    switch (currentFilter) {
      case "all":
        return taskList;
      case "completed":
        return taskList.filter((t) => t.done);
      case "pending":
        return taskList.filter((t) => !t.done);
      default:
        return taskList;
    }
  }, [currentFilter, taskList]);

  const handleAddTask = async () => {
    setLoading(true);
    try {
      if (task.length === 0 || !task) {
        toast.error('Por favor, insira uma tarefa válida.');
        setLoading(false);
        return;
      }
      const newTask = await addTasksFromDb(task);
      if (!newTask) return;
      await handleGetTasks();
      toast.success('Tarefa adicionada com sucesso!');
      setTask("");

    } catch (error) {
      throw error
    }
    setLoading(false);

  }

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) return
      const deletedTask = await deleteTaskFromDb(id);
      if (!deletedTask) return
      await handleGetTasks()
      toast.warning('Tarefa excluída com sucesso!');
    } catch (error) {
      throw error
    }
  }

  const handleToggleTask = async (id: string) => {
    const previousTasks = [...taskList];

    try {
      setTaskList((prevTasks) => {
        const updatedTasks = prevTasks.map((task) => {
          if (task.id === id) {
            return { ...task, done: !task.done };
          } else {
            return task;
          }
        });
        return updatedTasks;
      });

      await toggleDone(id);
    } catch (error) {
      setTaskList(previousTasks);
      throw error
    }
  }

  const clearCompletedTasks = async () => {
    const deletedTask = await deletecompletedTasks()
    if (!deletedTask) return
    setTaskList(deletedTask)  
  }

  return (
    <main className='w-full h-screen bg-gray-100 flex justify-center items-center'>

      <Card className='w-lg'>
        <CardHeader className='flex gap-2'>
          <Input placeholder='Adicionar Tarefa' value={task} onChange={(e) => setTask(e.target.value)} />
          <Button className='cursor-pointer' onClick={handleAddTask}>
            {loading ? (<LoaderCircle className='animate-spin' />) : (<Plus />)}
            Cadastrar
          </Button>
        </CardHeader>

        <CardContent>
          <Separator className='mb-4' />
          <Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />

          <div className='mt-4 border-b-1'>

            {filteredTasks.length === 0 && (<p className='text-xs border-t py-4'>Você não possui tarefas cadastradas</p>)}

            {filteredTasks.map((task) => (
              <div className='h-14 flex justify-between items-center border-t-1' key={task.id}>
                <div className={`${task.done ? 'w-1 h-full bg-green-400' : 'w-1 h-full bg-red-400'}`}></div>
                <p className={`flex-1 px-2 text-sm cursor-pointer hover:text-gray-700 ${task.done ? 'line-through text-gray-400' : ''}`}
                  onClick={() => handleToggleTask(task.id)}>
                  {task.task}
                </p>
                <div className='flex items-center gap-2'>
                  <EditTask task={task} handleGetTasks={handleGetTasks} />
                  <Trash onClick={() => handleDeleteTask(task.id)} className='cursor-pointer' size={16} />
                </div>
              </div>
            ))}

          </div>

          <div className='flex justify-between mt-4'>
            <div className='flex gap-2 items-center'>
              <ListCheck size={18} />
              <p className='text-xs'>Tarefas Concluídas ({taskList.filter(task => task.done).length}/{taskList.length})</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='text-xs h-7 cursor-pointer' variant={'outline'}> <Trash /> Limpar tarefas concluídas</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja excluir {taskList.filter(task => task.done).length} itens?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction className='cursor-pointer' onClick={clearCompletedTasks}>Sim</AlertDialogAction>
                  <AlertDialogCancel className='cursor-pointer'>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className='h-2 bg-gray-100 mt-4 rounded-md'>
            <div className='h-full w-[50%] bg-blue-500 rounded-md' style={{ width: `${((taskList.filter(task => task.done).length) / taskList.length) * 100}%` }}>
            </div>
          </div>

          <div className='flex justify-end items-center mt-2 gap-2'>
            <Sigma size={18} />
            <p>{taskList.length} tarefas no total</p>
          </div>

        </CardContent>
      </Card>

    </main>
  );
}
