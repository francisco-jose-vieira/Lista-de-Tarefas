import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SquarePen } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tasks } from '@/generated/prisma/client';
import { useState } from 'react';
import { toast } from 'sonner';
import { editedTask } from '@/actions/edit-task';

type TasksProps = {
  task: Tasks;
  handleGetTasks: () => void
}

export function EditTask({ task, handleGetTasks }: TasksProps) {
  const [editTask, setEditTask] = useState(task.task)

  const handleEditTask = async () => {
    try {
      if (editTask !== task.task) {
        toast.success('Tarefa editada com sucesso!');
      } else {
        toast.error('Nenhuma alteração feita na tarefa.');
        return;
      }
      await editedTask(task.id, editTask);

      handleGetTasks()
    } catch (error) {
      throw error
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen className='cursor-pointer' size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <div className='flex gap-2'>
          <Input
            placeholder='Editar tarefa'
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
          />

          <DialogClose>
            <Button
              className='cursor-pointer'
              onClick={handleEditTask}
            >Editar
            </Button>
          </DialogClose>

        </div>
      </DialogContent>
    </Dialog>
  )
}