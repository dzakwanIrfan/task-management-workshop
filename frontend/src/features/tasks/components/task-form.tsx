import { useState } from "react";
import type { Task } from "../types/task";
import { createTask } from "../api/tasks.api";

type TaskFormProps = {
  onCreated: (newTask: Task) => Promise<void>;
};

export function TaskForm({ onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const newTask = await createTask({
        title: cleanTitle,
        description: description.trim(),
      });
      await onCreated(newTask);
      setTitle("");
      setDescription("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal membuat task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <input
        value={title}
        placeholder="Task title"
        onChange={(event) => setTitle(event.target.value)}
        required
        maxLength={120}
        className="w-full rounded border p-2"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Task description"
        maxLength={500}
        className="w-full rounded border p-2"
      />
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Menyimpan..." : "Add Task"}
      </button>
    </form>
  );
}
