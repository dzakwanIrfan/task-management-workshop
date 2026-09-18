export type Task = {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
    title: string;
    description?: string | null;
}

export type UpdateTaskInput = {
    title?: string;
    description?: string | null;
    completed?: boolean;
}