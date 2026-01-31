'use client';
import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';

type KanbanBoardProps = {
    tasks: any[];
    onTaskUpdate: (id: string, status: string) => void;
    onDeleteTask: (id: string) => void;
    projectId: string;
}

export default function KanbanBoard({ tasks, onTaskUpdate, onDeleteTask, projectId }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns = ['TODO', 'IN_PROGRESS', 'DONE'];

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the task and its current status
        const activeTask = tasks.find(t => t.id === activeId);

        // If dropped over a column container directly
        if (columns.includes(overId)) {
            if (activeTask && activeTask.status !== overId) {
                onTaskUpdate(activeId, overId);
            }
        }
        // If dropped over another task
        else {
            const overTask = tasks.find(t => t.id === overId);
            if (overTask && activeTask && activeTask.status !== overTask.status) {
                onTaskUpdate(activeId, overTask.status);
            }
            // Note: Reordering within the same column is not persisted yet as per requirement, 
            // but visual feedback is handled by SortableContext if we managed local state fully.
            // For now, we focus on Status updates.
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
            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 h-full min-h-[500px]">
                {columns.map(status => (
                    <KanbanColumn
                        key={status}
                        id={status}
                        title={status.replace('_', ' ')}
                        tasks={tasksByStatus[status as keyof typeof tasksByStatus]}
                        onDeleteTask={onDeleteTask}
                        projectId={projectId}
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
