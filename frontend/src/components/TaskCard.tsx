'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarClock, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskCardProps {
    task: any;
    onDelete: (id: string) => void;
    isOverlay?: boolean;
}

export default function TaskCard({ task, onDelete, isOverlay }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (!task) return null;

    const priorityConfig = {
        HIGH: {
            badge: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200 dark:from-red-900/40 dark:to-rose-900/40 dark:text-red-300',
            border: 'border-l-red-500',
            glow: 'group-hover:shadow-red-200/50 dark:group-hover:shadow-red-900/30'
        },
        MEDIUM: {
            badge: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200 dark:from-amber-900/40 dark:to-yellow-900/40 dark:text-amber-300',
            border: 'border-l-amber-500',
            glow: 'group-hover:shadow-amber-200/50 dark:group-hover:shadow-amber-900/30'
        },
        LOW: {
            badge: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200 dark:from-emerald-900/40 dark:to-green-900/40 dark:text-emerald-300',
            border: 'border-l-emerald-500',
            glow: 'group-hover:shadow-emerald-200/50 dark:group-hover:shadow-emerald-900/30'
        },
    };

    const config = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.LOW;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <Card className={`group relative bg-white dark:bg-gray-900 hover:shadow-lg ${config.glow} transition-all duration-300 cursor-grab active:cursor-grabbing border-l-4 ${config.border} hover:-translate-y-0.5 ${isOverlay ? 'shadow-2xl rotate-2 scale-105 ring-2 ring-indigo-400' : ''}`}>
                <CardHeader className="p-3 pb-0 space-y-0">
                    <div className="flex justify-between items-start">
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border-0 font-bold uppercase tracking-wide ${config.badge}`}>
                            {task.priority}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 opacity-0 group-hover:opacity-100 transition-all">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem asChild>
                                    <Link href={`/projects/${task.projectId}/tasks/${task.id}/edit`} className="flex items-center cursor-pointer">
                                        <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <CardTitle className="text-sm font-bold leading-tight line-clamp-2 mt-2 text-gray-800 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                        {task.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                    {task.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                            {task.description}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-gray-400">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-full">
                        <CalendarClock className="w-3 h-3 text-indigo-500" />
                        <span className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Avatar className="h-7 w-7 border-2 border-white dark:border-gray-900 ring-2 ring-indigo-100 dark:ring-indigo-900/30 transition-transform group-hover:scale-110">
                        <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 dark:from-indigo-900 dark:to-violet-900 dark:text-indigo-200">
                            {task.assignee?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </CardFooter>
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-violet-500/0 to-fuchsia-500/0 group-hover:from-indigo-500/[0.02] group-hover:via-violet-500/[0.02] group-hover:to-fuchsia-500/[0.02] rounded-r-lg pointer-events-none transition-all duration-300" />
            </Card>
        </div>
    );
}
