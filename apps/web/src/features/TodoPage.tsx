import type { ComponentProps } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { authClient } from "../auth-client";
import { TodoItem } from "./TodoItem";
import { useTodos } from "./useTodos";

export type TodoFilter = "all" | "active" | "done";

export const todoFilters: TodoFilter[] = ["all", "active", "done"];

export function TodoPage({ filter, setFilter }: TodoPageProps) {
  const [text, setText] = useState("");
  const todos = useTodos();
  const visibleTodoIds = todos.todoIds(filter);

  const submit: NonNullable<ComponentProps<"form">["onSubmit"]> = async (
    event,
  ) => {
    event.preventDefault();
    const nextText = text.trim();
    if (!nextText) return;
    await todos.addTodo(nextText);
    setText("");
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <Card className="mx-auto max-w-xl rounded-3xl border-white/10 bg-card shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-3xl tracking-tight">Todos</CardTitle>
          <Button
            type="button"
            variant="ghost"
            onClick={async () => {
              await authClient.signOut();
              window.location.href = "/login";
            }}
          >
            Sign out
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="flex gap-2">
            <Input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Add a todo"
              className="h-12 rounded-xl bg-muted"
            />
            <Button type="submit" className="h-12 rounded-xl px-5">
              Add
            </Button>
          </form>

          <div className="mt-4 flex gap-2">
            {todoFilters.map((name) => (
              <Button
                type="button"
                key={name}
                variant={filter === name ? "default" : "ghost"}
                onClick={() => setFilter(name)}
                className="capitalize"
              >
                {name}
              </Button>
            ))}
          </div>

          <ul className="mt-6 space-y-3">
            {visibleTodoIds.map((id) => (
              <TodoItem key={id} id={id} todos={todos} />
            ))}
          </ul>

          {visibleTodoIds.length === 0 && (
            <Empty className="mt-6 rounded-2xl">No todos here.</Empty>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

type TodoPageProps = {
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
};
