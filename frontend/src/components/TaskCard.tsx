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

    const priorityColor = {
        HIGH: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
        MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
        LOW: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <Card className={`group relative hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border-l-4 ${task.priority === 'HIGH' ? 'border-l-red-500' :
                    task.priority === 'MEDIUM' ? 'border-l-yellow-500' : 'border-l-green-500'
                } ${isOverlay ? 'shadow-xl rotate-2 scale-105' : ''}`}>
                <CardHeader className="p-3 pb-0 space-y-0">
                    <div className="flex justify-between items-start">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border-0 font-semibold ${priorityColor[task.priority as keyof typeof priorityColor] || 'bg-gray-100'}`}>
                            {task.priority}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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
                    <CardTitle className="text-sm font-semibold leading-tight line-clamp-2 mt-2">
                        {task.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                    {task.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                            {task.description}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" />
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Avatar className="h-6 w-6 border-2 border-white dark:border-gray-950">
                        <AvatarFallback className="text-[10px] bg-slate-200 dark:bg-slate-700">
                            {task.assignee?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </CardFooter>
            </Card>
        </div>
    );
}
