import type { Todo } from "@monobara/contract";
import { useEffect, useState } from "react";
import { orpc } from "../orpc";

export type TodoFilter = "all" | "active" | "done";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    setTodos(await orpc.todos.list());
  }

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
    setTodos(await orpc.todos.add({ text }));
  }

  async function toggleTodo(id: string) {
    setTodos(await orpc.todos.toggle({ id }));
  }

  async function deleteTodo(id: string) {
    setTodos(await orpc.todos.delete({ id }));
  }

  return { todos, todoIds, addTodo, toggleTodo, deleteTodo };
}
