import { Task } from "../types/task";

type TaskItemProps = {
    task: Task;
    handleToggle: (task: Task) => Promise<void>;
    handleDelete: (task: Task) => Promise<void>;
}

export function TaskItem({ task, handleToggle, handleDelete }: TaskItemProps) {
  return (
    <li
      key={task.id}
      className="rounded-lg border border-gray-200 bg-white p-4 cursor-pointer hover:bg-gray-50"
      onClick={() => handleToggle(task)}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
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
      <p className="mt-2 text-sm leading-6 text-gray-600">{task.description}</p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className="text-sm text-red-600 cursor-pointer px-3 py-1 hover:bg-red-50"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(task);
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
