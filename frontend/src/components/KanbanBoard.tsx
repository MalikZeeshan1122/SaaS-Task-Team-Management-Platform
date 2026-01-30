'use client';
import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { redirect } from 'next/dist/server/api-utils';

export default function KanbanBoard({ tasks, onTaskUpdate, onDeleteTask }: { tasks: any[], onTaskUpdate: (id: string, status: string) => void, onDeleteTask: (id: string) => void }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns = ['TODO', 'IN_PROGRESS', 'DONE'];

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        // If dropped over a container (column)
        if (columns.includes(overId)) {
            onTaskUpdate(activeId, overId);
        } else {
            // If dropped over another item, find that item's status
            // For simplicity in this version, we'll just check if the overId is a task and what its status would be.
            // But actually, just dropping on the column container is the easiest implementation for status change.
            // We will implement Droppable columns.
        }

        setActiveId(null);
    };

    // Group tasks by status
    const tasksByStatus = {
        TODO: tasks.filter(t => t.status === 'TODO'),
        IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
        DONE: tasks.filter(t => t.status === 'DONE'),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 h-full">
                {columns.map(status => (
                    <KanbanColumn
                        key={status}
                        id={status}
                        title={status.replace('_', ' ')}
                        tasks={tasksByStatus[status as keyof typeof tasksByStatus]}
                        onDeleteTask={onDeleteTask}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeId ? (
                    <TaskCard task={tasks.find(t => t.id === activeId)} onDelete={() => { }} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
