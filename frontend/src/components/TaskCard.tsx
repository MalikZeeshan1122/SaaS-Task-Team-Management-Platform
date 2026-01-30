'use client';
import { useDraggable } from '@dnd-kit/core';
import Link from 'next/link';

export default function TaskCard({ task, onDelete, isOverlay }: { task: any, onDelete: (id: string) => void, isOverlay?: boolean }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    if (!task) return null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-white p-3 rounded shadow hover:shadow-md transition cursor-grab active:cursor-grabbing group relative ${isOverlay ? 'shadow-xl rotate-2 opacity-90' : ''}`}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800 mb-1">{task.title}</h4>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Link href={`/projects/${task.projectId}/tasks/${task.id}/edit`} className="text-xs text-blue-500 hover:text-blue-700">Edit</Link>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="text-xs text-red-500 hover:text-red-700">Del</button>
                </div>
            </div>
            {task.description && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{task.description}</p>}

            <div className="flex justify-between items-center mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        task.priority === 'LOW' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                    }`}>
                    {task.priority}
                </span>
            </div>
        </div>
    );
}
