"use client";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/features/tasks/api/tasks.api";
import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskItem } from "@/features/tasks/components/task-item";
import { CreateTaskInput, Task } from "@/features/tasks/types/task";
import { useState, useEffect } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const data = await getTasks();
        setTasks(data);
      } catch {
        setError(new Error("Failed to fetch tasks."));
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  async function handleCreateTask(newTask: Task) {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  async function handleToggle(task: Task) {
    const response = await fetch(`http://localhost:3001/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    const updatedTask = await updateTask(task.id, {
      completed: !task.completed,
    });
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id ? updatedTask : currentTask,
      ),
    );
  }

  async function handleDelete(task: Task) {
    if (!confirm(`Are you sure you want to delete ${task.title}?`)) return;
    await deleteTask(task.id);

    setTasks((currentTasks) => currentTasks.filter((t) => t.id !== task.id));
  }

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
