import { Task } from "../types/task";
import { TaskForm } from "./task-form";
import { TaskItem } from "./task-item";

type TaskViewProps = {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  handleCreateTask: (newTask: Task) => Promise<void>;
  handleToggle: (task: Task) => Promise<void>;
  handleDelete: (task: Task) => Promise<void>;
};

export function TaskView({
  tasks,
  loading,
  error,
  handleCreateTask,
  handleToggle,
  handleDelete,
}: TaskViewProps) {
  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-gray-600">Manage your tasks here.</p>
        <span className="mx-auto mt-4 block h-4 w-4 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </main>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <p className="text-gray-600 mb-6">Manage your tasks here.</p>

      <TaskForm onCreated={handleCreateTask} />

      <ul className="mt-6 space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            handleToggle={handleToggle}
            handleDelete={handleDelete}
          />
        ))}
      </ul>
    </main>
  );
}
