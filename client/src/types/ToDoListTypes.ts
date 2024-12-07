export interface Task { // Container for the each task element that it contains
    task_id: string;
    text: string
    createdAt: Date
    dueAt: Date
    completed: boolean
}

export interface ToDoListProps {
    variant?: "default" | "compact";
}