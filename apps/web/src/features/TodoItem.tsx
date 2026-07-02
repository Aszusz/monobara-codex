import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { useTodos } from "./useTodos";

export function TodoItem({ id, todos }: TodoItemProps) {
  const todo = todos.todos.find((todo) => todo.id === id);

  if (!todo) return null;

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-muted p-3">
      <Checkbox
        checked={todo.done}
        onCheckedChange={() => void todos.toggleTodo(todo.id)}
        className="size-5"
      />
      <span
        className={`flex-1 ${todo.done ? "text-muted-foreground line-through" : ""}`}
      >
        {todo.text}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => void todos.deleteTodo(todo.id)}
        className="text-muted-foreground hover:text-destructive"
      >
        Delete
      </Button>
    </li>
  );
}

type TodoItemProps = {
  id: string;
  todos: ReturnType<typeof useTodos>;
};
