"use client";

import { useState, useEffect } from "react";

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await fetch("http://localhost:3001/tasks");

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();

        setTasks(data);
      } catch {
        setError(new Error("Failed to fetch tasks."));
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    const newTask = await response.json();
    setTasks((currentTasks) => [...currentTasks, newTask]);

    setTitle("");
    setDescription("");
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

      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <input
          value={title}
          placeholder="Task title"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border p-2"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="w-full rounded border p-2"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {task.title}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  task.completed
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.completed ? "Completed" : "Incomplete"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {task.description}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
