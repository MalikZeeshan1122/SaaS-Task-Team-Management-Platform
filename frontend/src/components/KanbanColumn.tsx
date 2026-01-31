'use client';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: any[];
    onDeleteTask: (id: string) => void;
    projectId?: string; // Need projectId to link to new task page
}

export default function KanbanColumn({ id, title, tasks, onDeleteTask, projectId }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    const statusColors = {
        TODO: 'bg-slate-100 text-slate-700 border-t-4 border-slate-500 dark:bg-slate-900/50 dark:text-slate-200',
        IN_PROGRESS: 'bg-blue-50 text-blue-700 border-t-4 border-blue-500 dark:bg-blue-900/20 dark:text-blue-200',
        DONE: 'bg-green-50 text-green-700 border-t-4 border-green-500 dark:bg-green-900/20 dark:text-green-200',
    };

    return (
        <div className={`flex-1 min-w-[300px] flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 h-full max-h-full ${statusColors[id as keyof typeof statusColors] || 'bg-gray-100'}`}>
            {/* Header */}
            <div className="p-4 pb-2 flex items-center justify-between">
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-2 uppercase">
                    {title}
                </h3>
                <Badge variant="secondary" className="bg-white/50 dark:bg-black/20 font-mono text-xs">
                    {tasks.length}
                </Badge>
            </div>

            {/* Task Area */}
            <div ref={setNodeRef} className="flex-1 p-3 min-h-[150px] relative">
                <ScrollArea className="h-full pr-3 -mr-3">
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-3 pb-3">
                            {tasks.map(task => (
                                <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
                            ))}
                            {tasks.length === 0 && (
                                <div className="h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm gap-2 bg-white/30 dark:bg-black/10">
                                    <span>Drop items here</span>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </ScrollArea>
            </div>

            {/* Footer Action */}
            <div className="p-3 pt-0 mt-auto">
                <Link href={projectId ? `/projects/${projectId}/tasks/new?status=${id}` : '#'}>
                    <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-white/50 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </Link>
            </div>
        </div>
    );
}
