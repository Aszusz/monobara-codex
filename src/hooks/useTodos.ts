import { create } from "zustand";

type Todo = { id: string; text: string; done: boolean };
export type TodoFilter = "all" | "active" | "done";

type TodoStore = {
  todos: Todo[];
  todoIds: (filter: TodoFilter) => string[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
};

export const useTodos = create<TodoStore>((set, get) => ({
  todos: [],
  todoIds: (filter) =>
    get()
      .todos.filter((todo) => {
        if (filter === "active") return !todo.done;
        if (filter === "done") return todo.done;
        return true;
      })
      .map((todo) => todo.id),
  addTodo: (text) =>
    set((state) => ({
      todos: [{ id: crypto.randomUUID(), text, done: false }, ...state.todos],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    })),
  deleteTodo: (id) =>
    set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
}));
