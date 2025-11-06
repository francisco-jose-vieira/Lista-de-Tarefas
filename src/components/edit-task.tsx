import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SquarePen } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function EditTask() {
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
          <Input placeholder='Editar tarefa' />
          <Button className='cursor-pointer'>Editar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}