import { contract, type Todo } from "@monobara/contract";
import { addTodo, deleteTodo, listTodos, toggleTodo } from "@monobara/db";
import { implement, ORPCError } from "@orpc/server";

const os = implement(contract);

export const router = os.router({
  todos: {
    list: os.todos.list.handler(
      ({ context }): Promise<Todo[]> => listTodos(userId(context)),
    ),
    add: os.todos.add.handler(({ context, input }) =>
      addTodo(userId(context), input.text),
    ),
    toggle: os.todos.toggle.handler(({ context, input }) =>
      toggleTodo(userId(context), input.id),
    ),
    delete: os.todos.delete.handler(({ context, input }) =>
      deleteTodo(userId(context), input.id),
    ),
  },
});

function userId(context: unknown) {
  const userId = (context as { userId?: string }).userId;
  if (!userId) throw new ORPCError("UNAUTHORIZED");
  return userId;
}
