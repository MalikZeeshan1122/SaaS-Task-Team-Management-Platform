'use client';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

export default function KanbanColumn({ id, title, tasks, onDeleteTask }: { id: string, title: string, tasks: any[], onDeleteTask: (id: string) => void }) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[300px] bg-gray-100 rounded-lg p-4 flex flex-col">
            <h3 className="font-bold text-gray-700 mb-3 uppercase text-sm tracking-wide">{title} <span className="text-gray-400 ml-2">{tasks.length}</span></h3>
            <div className="flex-1 flex flex-col gap-3">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
                ))}
                {tasks.length === 0 && (
                    <div className="h-full min-h-[100px] border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-sm">
                        Drop items here
                    </div>
                )}
            </div>
        </div>
    );
}
