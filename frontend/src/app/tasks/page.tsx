"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, type PublicUser } from "@/features/auth/api/auth.api";
import { clearToken } from "@/features/auth/session";
import { deleteTask, getTasks, updateTask } from "@/features/tasks/api/tasks.api";
import { TaskView } from "@/features/tasks/components/task-view";
import type { Task } from "@/features/tasks/types/task";

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      try {
        const currentUser = await getMe();
        if (active) setUser(currentUser);
        const data = await getTasks();
        if (active) {
          setTasks(data);
        }
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause : new Error("Gagal memuat task"));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadTasks();
    return () => { active = false; };
  }, []);

  async function handleCreateTask(newTask: Task) {
    setTasks((current) => [...current, newTask]);
  }

  async function handleToggle(task: Task) {
    setActionError("");
    try {
      const updatedTask = await updateTask(task.id, {
        completed: !task.completed,
      });
      setTasks((current) =>
        current.map((item) => item.id === updatedTask.id ? updatedTask : item),
      );
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Gagal mengubah task");
    }
  }

  async function handleDelete(task: Task) {
    if (!confirm(`Hapus task ${task.title}?`)) return;
    setActionError("");
    try {
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Gagal menghapus task");
    }
  }

  function handleLogout() {
    clearToken();
    setUser(null);
    setTasks([]);
    setActionError("");
    router.replace("/login");
  }

  return (
    <>
      {user && (
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-6">
          <span>Login sebagai {user.email}</span>
          <button type="button" onClick={handleLogout} className="text-blue-600">
            Logout
          </button>
        </div>
      )}
      {actionError && (
        <p role="alert" className="mx-auto max-w-3xl px-6 text-red-600">
          {actionError}
        </p>
      )}
      <TaskView
        tasks={tasks}
        loading={loading}
        error={error}
        handleCreateTask={handleCreateTask}
        handleToggle={handleToggle}
        handleDelete={handleDelete}
      />
    </>
  );
}
