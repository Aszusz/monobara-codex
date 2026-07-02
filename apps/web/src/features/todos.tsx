import type { Todo } from "@monobara/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { authClient } from "../auth-client";
import { orpc } from "../orpc";

export type TodoFilter = "all" | "active" | "done";

export const todoFilters: TodoFilter[] = ["all", "active", "done"];

const todosQueryKey = ["todos"] as const;

export function TodoPage({ filter, setFilter, goLogin }: TodoPageProps) {
  const session = authClient.useSession();

  useEffect(() => {
    if (!session.isPending && !session.data) void goLogin();
  }, [goLogin, session.data, session.isPending]);

  if (session.isPending) return null;
  if (!session.data) return null;

  return <TodosApp filter={filter} setFilter={setFilter} />;
}

function TodosApp({ filter, setFilter }: TodosAppProps) {
  const [text, setText] = useState("");
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
          {todoFilters.map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => setFilter(name)}
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

function useTodos() {
  const queryClient = useQueryClient();
  const { data: todos = [] } = useQuery({
    queryKey: todosQueryKey,
    queryFn: () => orpc.todos.list(),
  });

  function setTodos(todos: Todo[]) {
    queryClient.setQueryData(todosQueryKey, todos);
  }

  const addTodoMutation = useMutation({
    mutationFn: (text: string) => orpc.todos.add({ text }),
    onSuccess: setTodos,
  });

  const toggleTodoMutation = useMutation({
    mutationFn: (id: string) => orpc.todos.toggle({ id }),
    onSuccess: setTodos,
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => orpc.todos.delete({ id }),
    onSuccess: setTodos,
  });

  function todoIds(filter: TodoFilter) {
    return todos
      .filter((todo) => {
        if (filter === "active") return !todo.done;
        if (filter === "done") return todo.done;
        return true;
      })
      .map((todo) => todo.id);
  }

  async function addTodo(text: string) {
    await addTodoMutation.mutateAsync(text);
  }

  async function toggleTodo(id: string) {
    await toggleTodoMutation.mutateAsync(id);
  }

  async function deleteTodo(id: string) {
    await deleteTodoMutation.mutateAsync(id);
  }

  return { todos, todoIds, addTodo, toggleTodo, deleteTodo };
}

function TodoItem({ id, todos }: TodoItemProps) {
  const todo = todos.todos.find((todo) => todo.id === id);

  if (!todo) return null;

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => void todos.toggleTodo(todo.id)}
        className="size-5 accent-cyan-400"
      />
      <span
        className={`flex-1 ${todo.done ? "text-slate-500 line-through" : ""}`}
      >
        {todo.text}
      </span>
      <button
        type="button"
        onClick={() => void todos.deleteTodo(todo.id)}
        className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/10 hover:text-red-300"
      >
        Delete
      </button>
    </li>
  );
}

type TodoItemProps = {
  id: string;
  todos: ReturnType<typeof useTodos>;
};

type TodoPageProps = {
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  goLogin: () => void;
};

type TodosAppProps = {
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
};
