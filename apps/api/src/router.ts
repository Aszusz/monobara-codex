import { os } from "@orpc/server";
import { z } from "zod";

type Todo = { id: string; text: string; done: boolean };

const todos: Todo[] = [];

export function resetTodos() {
  todos.length = 0;
}

export const router = {
  todos: {
    list: os.handler(() => todos),
    add: os
      .input(z.object({ text: z.string().trim().min(1) }))
      .handler(({ input }) => {
        todos.unshift({
          id: crypto.randomUUID(),
          text: input.text,
          done: false,
        });
        return todos;
      }),
    toggle: os.input(z.object({ id: z.string() })).handler(({ input }) => {
      const todo = todos.find((todo) => todo.id === input.id);
      if (todo) todo.done = !todo.done;
      return todos;
    }),
    delete: os.input(z.object({ id: z.string() })).handler(({ input }) => {
      const index = todos.findIndex((todo) => todo.id === input.id);
      if (index !== -1) todos.splice(index, 1);
      return todos;
    }),
  },
};

export type AppRouter = typeof router;
