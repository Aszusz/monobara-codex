import { contract, type Todo } from "@monobara/contract";
import { implement } from "@orpc/server";

const os = implement(contract);

const todos: Todo[] = [];

export function resetTodos() {
  todos.length = 0;
}

export const router = os.router({
  todos: {
    list: os.todos.list.handler(() => todos),
    add: os.todos.add.handler(({ input }) => {
      todos.unshift({
        id: crypto.randomUUID(),
        text: input.text,
        done: false,
      });
      return todos;
    }),
    toggle: os.todos.toggle.handler(({ input }) => {
      const todo = todos.find((todo) => todo.id === input.id);
      if (todo) todo.done = !todo.done;
      return todos;
    }),
    delete: os.todos.delete.handler(({ input }) => {
      const index = todos.findIndex((todo) => todo.id === input.id);
      if (index !== -1) todos.splice(index, 1);
      return todos;
    }),
  },
});
