import { authFetch } from "@/features/auth/api/auth-fetch";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";

export async function getTasks(): Promise<Task[]> {
  const response = await authFetch("/tasks");
  if (!response.ok) throw new Error("Gagal mengambil task");
  return response.json();
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await authFetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Gagal membuat task");
  return response.json();
}

export async function updateTask(
  id: number,
  input: UpdateTaskInput,
): Promise<Task> {
  const response = await authFetch(`/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Gagal mengubah task");
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await authFetch(`/tasks/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Gagal menghapus task");
}
