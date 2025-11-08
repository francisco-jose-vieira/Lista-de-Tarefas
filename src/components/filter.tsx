import { ArrowDownRight, Check, List } from "lucide-react";
import { Badge } from "./ui/badge";

type FilterProps = {
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
}


export function Filter({ currentFilter, setCurrentFilter }: FilterProps) {


  return (
    <div className='flex gap-2'>
      <Badge
        className='cursor-pointer'
        variant={`${currentFilter === 'all' ? ('default') : ('outline')}`}
        onClick={() => setCurrentFilter('all')}><List />Todas</Badge>
      <Badge
        className='cursor-pointer'
        variant={`${currentFilter === 'pending' ? ('default') : ('outline')}`}
        onClick={() => setCurrentFilter('pending')}> <ArrowDownRight />Não Finalizadas</Badge>
      <Badge
        className='cursor-pointer'
        variant={`${currentFilter === 'completed' ? ('default') : ('outline')}`}
        onClick={() => setCurrentFilter('completed')}> <Check />Concluídas</Badge>
    </div>
  )
}