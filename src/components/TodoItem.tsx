import { useTodos } from "../hooks/useTodos";

type TodoItemProps = {
  id: string;
};

export function TodoItem({ id }: TodoItemProps) {
  const { todos, toggleTodo, deleteTodo } = useTodos();
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) return null;

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => toggleTodo(todo.id)}
        className="size-5 accent-cyan-400"
      />
      <span className={`flex-1 ${todo.done ? "text-slate-500 line-through" : ""}`}>
        {todo.text}
      </span>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/10 hover:text-red-300"
      >
        Delete
      </button>
    </li>
  );
}
