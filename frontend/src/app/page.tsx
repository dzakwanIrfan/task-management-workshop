import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Task Management</h1>
        <p className="mt-4 text-gray-600">
          Simple task management application.
        </p>
        <Link
          href="/tasks"
          className="mt-6 inline-block rounded bg-black px-4 py-2 text-white"
        >
          View Tasks
        </Link>
      </div>
    </main>
  );
}
