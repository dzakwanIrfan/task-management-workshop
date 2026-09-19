import { useState } from "react";
import { Task } from "../types/task";
import { createTask } from "../api/tasks.api";

type TaskFormProps = {
    onCreated: (newTask: Task) => Promise<void>;
}

export function TaskForm({ onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const newTask = await createTask({ title, description});
    onCreated(newTask);

    setTitle("");
    setDescription("");
  }

  return (
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
  );
}
