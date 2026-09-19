"use client";

import {
  deleteTask,
  getTasks,
  updateTask,
} from "@/features/tasks/api/tasks.api";
import { TaskView } from "@/features/tasks/components/task-view";
import { Task } from "@/features/tasks/types/task";
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

  return (
    <TaskView
      tasks={tasks}
      loading={loading}
      error={error}
      handleCreateTask={handleCreateTask}
      handleToggle={handleToggle}
      handleDelete={handleDelete}
    />
  );
}
