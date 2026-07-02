import type { useTodos } from "./useTodos";

export function TodoItem({ id, todos }: TodoItemProps) {
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
