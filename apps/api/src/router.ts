import { contract, type Todo } from "@monobara/contract";
import { addTodo, deleteTodo, listTodos, toggleTodo } from "@monobara/db";
import { implement } from "@orpc/server";

const os = implement(contract);

export const router = os.router({
  todos: {
    list: os.todos.list.handler((): Promise<Todo[]> => listTodos()),
    add: os.todos.add.handler(({ input }) => addTodo(input.text)),
    toggle: os.todos.toggle.handler(({ input }) => toggleTodo(input.id)),
    delete: os.todos.delete.handler(({ input }) => deleteTodo(input.id)),
  },
});
