import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { authClient } from "../../auth-client";
import { TodoItem } from "../../components/TodoItem";
import type { TodoFilter } from "../../hooks/useTodos";
import { useTodos } from "../../hooks/useTodos";

const filters: TodoFilter[] = ["all", "active", "done"];

export const Route = createFileRoute("/_protected/todos")({
  validateSearch: (search: Record<string, unknown>) => ({
    filter: filters.includes(search.filter as TodoFilter)
      ? (search.filter as TodoFilter)
      : "all",
  }),
  component: TodoPage,
});

function TodoPage() {
  const session = authClient.useSession();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (!session.isPending && !session.data) void navigate({ to: "/login" });
  }, [navigate, session.data, session.isPending]);

  if (session.isPending) return null;
  if (!session.data) return null;

  return <TodosApp />;
}

function TodosApp() {
  const [text, setText] = useState("");
  const { filter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const todos = useTodos();
  const visibleTodoIds = todos.todoIds(filter);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextText = text.trim();
    if (!nextText) return;
    await todos.addTodo(nextText);
    setText("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-xl rounded-3xl bg-white/10 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Todos</h1>
          <button
            type="button"
            onClick={async () => {
              await authClient.signOut();
              window.location.href = "/login";
            }}
            className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/10"
          >
            Sign out
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 flex gap-2">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a todo"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Add
          </button>
        </form>

        <div className="mt-4 flex gap-2">
          {filters.map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => navigate({ search: { filter: name } })}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                filter === name
                  ? "bg-slate-100 text-slate-950"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <ul className="mt-6 space-y-3">
          {visibleTodoIds.map((id) => (
            <TodoItem key={id} id={id} todos={todos} />
          ))}
        </ul>

        {visibleTodoIds.length === 0 && (
          <p className="mt-6 rounded-2xl border border-dashed border-white/20 p-6 text-center text-slate-400">
            No todos here.
          </p>
        )}
      </section>
    </main>
  );
}
