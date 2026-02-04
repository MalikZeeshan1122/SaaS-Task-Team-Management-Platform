'use client';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: any[];
    onDeleteTask: (id: string) => void;
    projectId?: string;
}

export default function KanbanColumn({ id, title, tasks, onDeleteTask, projectId }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const statusColors = {
        TODO: {
            bg: 'bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-900/30',
            border: 'border-t-4 border-slate-400 dark:border-slate-500',
            badge: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
            icon: '📋'
        },
        IN_PROGRESS: {
            bg: 'bg-gradient-to-b from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10',
            border: 'border-t-4 border-blue-500 dark:border-blue-400',
            badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200',
            icon: '🚀'
        },
        DONE: {
            bg: 'bg-gradient-to-b from-emerald-50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/10',
            border: 'border-t-4 border-emerald-500 dark:border-emerald-400',
            badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200',
            icon: '✅'
        },
    };

    const config = statusColors[id as keyof typeof statusColors] || statusColors.TODO;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex-1 min-w-[320px] flex flex-col rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 dark:border-gray-700/50 h-full max-h-full backdrop-blur-sm transition-all duration-300 ${config.bg} ${config.border} ${isOver ? 'ring-2 ring-indigo-400 ring-offset-2 scale-[1.02]' : ''}`}
        >
            {/* Header */}
            <div className="p-4 pb-2 flex items-center justify-between">
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-2 uppercase text-gray-700 dark:text-gray-200">
                    <span className="text-lg">{config.icon}</span>
                    {title}
                </h3>
                <Badge className={`${config.badge} font-mono text-xs px-2.5 py-0.5 rounded-full`}>
                    {tasks.length}
                </Badge>
            </div>

            {/* Task Area */}
            <div ref={setNodeRef} className={`flex-1 p-3 min-h-[150px] relative transition-colors ${isOver ? 'bg-indigo-100/30 dark:bg-indigo-900/20' : ''}`}>
                <ScrollArea className="h-full pr-3 -mr-3">
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-3 pb-3">
                            {tasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <TaskCard task={task} onDelete={onDeleteTask} />
                                </motion.div>
                            ))}
                            {tasks.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-32 border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 rounded-xl flex flex-col items-center justify-center text-gray-400 text-sm gap-2 bg-white/30 dark:bg-black/10"
                                >
                                    <span className="text-2xl opacity-50">📥</span>
                                    <span>Drop tasks here</span>
                                </motion.div>
                            )}
                        </div>
                    </SortableContext>
                </ScrollArea>
            </div>

            {/* Footer Action */}
            <div className="p-3 pt-0 mt-auto">
                <Link href={projectId ? `/projects/${projectId}/tasks/new?status=${id}` : '#'}>
                    <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-indigo-600 hover:bg-white/70 dark:hover:bg-gray-800/70 dark:text-gray-400 dark:hover:text-indigo-400 rounded-xl transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}
