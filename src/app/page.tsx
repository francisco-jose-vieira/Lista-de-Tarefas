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


  const completedTasksCount = taskList.filter(task => task.done).length;
  const totalTasksCount = taskList.length;
  const completionPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  return (
    <main className='w-full min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center items-center p-4'>

      <Card className='w-full max-w-lg'>
        <CardHeader className='flex-row gap-2 items-center'>
          <Input
            placeholder='Adicionar Tarefa'
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <Button className='cursor-pointer flex-shrink-0 gap-2' onClick={handleAddTask} disabled={loading}>
            {loading ? (<LoaderCircle className='animate-spin h-4 w-4' />) : (<Plus className='h-4 w-4' />)}
            Cadastrar
          </Button>
        </CardHeader>

        <CardContent>
          <Separator className='mb-4' />
          <Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />

          <div className='mt-4 border-b'>

            {filteredTasks.length === 0 && (
              <p className='text-sm text-center text-muted-foreground py-4 border-t'>
                Você não possui tarefas {currentFilter !== 'all' ? 'nessa categoria' : 'cadastradas'}.
              </p>
            )}

            {filteredTasks.map((task) => (
              <div
                className='h-14 flex justify-between items-center border-t'
                key={task.id}
              >
                <div className={`w-1 h-full transition-colors ${task.done ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                <p
                  className={`flex-1 px-4 text-sm cursor-pointer transition-colors ${task.done ? 'line-through text-gray-500' : 'text-gray-800 '}`}
                  onClick={() => handleToggleTask(task.id)}
                >
                  {task.task}
                </p>
                <div className='flex items-center gap-1 pr-2'>
                  <EditTask task={task} handleGetTasks={handleGetTasks} />

                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                    <Trash className='h-4 w-4 text-red-400' />
                  </Button>
                </div>
              </div>
            ))}

          </div>

          <div className='flex flex-col sm:flex-row justify-between items-center mt-4 gap-4'>
            <div className='flex gap-2 items-center'>
              <ListCheck size={18} className='text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>
                Concluídas ({completedTasksCount}/{totalTasksCount})
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className='text-xs h-8 gap-2'
                  variant={'outline'}
                  size="sm"
                  disabled={completedTasksCount === 0}
                >
                  <Trash className='h-4 w-4' /> Limpar concluídas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja excluir {completedTasksCount} itens?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='cursor-pointer'>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className='cursor-pointer' onClick={clearCompletedTasks}>Sim, excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className='h-2 bg-muted mt-4 rounded-full overflow-hidden'>
            <div
              className='h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out'
              style={{ width: `${completionPercentage}%` }}
            >
            </div>
          </div>

          <div className='flex justify-end items-center mt-2 gap-2 text-sm text-muted-foreground'>
            <Sigma size={16} />
            <p>{totalTasksCount} tarefas no total</p>
          </div>

        </CardContent>
      </Card>

    </main>
  );
}