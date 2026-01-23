import { Task, Developer, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

interface TaskListProps {
  tasks: Task[];
  developers: Developer[];
  groupBy?: 'status' | 'assignee' | 'none';
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskAssign?: (taskId: string, developerId: string | null) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

const statusOrder: TaskStatus[] = ['in-progress', 'todo', 'review', 'backlog', 'done'];

const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
};

export const TaskList = ({ tasks, developers, groupBy = 'status', onTaskStatusChange, onTaskAssign, onTaskUpdate }: TaskListProps) => {
  const getAssignee = (assigneeId?: string) => 
    developers.find((dev) => dev.id === assigneeId);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get new status from destination droppable ID
    const newStatus = destination.droppableId as TaskStatus;
    
    if (onTaskStatusChange) {
      onTaskStatusChange(draggableId, newStatus);
    }
  };

  if (groupBy === 'status') {
    const groupedTasks = statusOrder.reduce((acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {statusOrder.map((status) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">
                  {statusLabels[status]}
                </h3>
                <span className="text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
                  {groupedTasks[status].length}
                </span>
              </div>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "space-y-3 min-h-[200px] rounded-lg p-2 transition-colors",
                      snapshot.isDraggingOver && "bg-accent/50 ring-2 ring-primary/20"
                    )}
                  >
                    {groupedTasks[status].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "transition-transform",
                              snapshot.isDragging && "rotate-2 scale-105"
                            )}
                          >
                            <TaskCard
                              task={task}
                              assignee={getAssignee(task.assigneeId)}
                              developers={developers}
                              onAssign={onTaskAssign}
                              onUpdate={onTaskUpdate}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {groupedTasks[status].length === 0 && !snapshot.isDraggingOver && (
                      <div className="rounded-lg border-2 border-dashed border-border p-4 text-center">
                        <p className="text-sm text-muted-foreground">No tasks</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          assignee={getAssignee(task.assigneeId)}
          developers={developers}
          onAssign={onTaskAssign}
          onUpdate={onTaskUpdate}
        />
      ))}
    </div>
  );
};
