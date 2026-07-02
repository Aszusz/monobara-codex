import { randomUUID } from "node:crypto";
import type { Todo } from "@monobara/contract";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { todos } from "./schema";

const sql = postgres(
  process.env.DATABASE_URL ??
    "postgres://monobara:monobara@localhost:5432/monobara",
);
const db = drizzle(sql);

export async function listTodos(): Promise<Todo[]> {
  return db.select(todoColumns).from(todos).orderBy(desc(todos.createdAt));
}

export async function addTodo(text: string): Promise<Todo[]> {
  await db.insert(todos).values({
    id: randomUUID(),
    text,
  });

  return listTodos();
}

export async function toggleTodo(id: string): Promise<Todo[]> {
  const [todo] = await db
    .select({ done: todos.done })
    .from(todos)
    .where(eq(todos.id, id));

  if (todo) {
    await db.update(todos).set({ done: !todo.done }).where(eq(todos.id, id));
  }

  return listTodos();
}

export async function deleteTodo(id: string): Promise<Todo[]> {
  await db.delete(todos).where(eq(todos.id, id));
  return listTodos();
}

export async function resetTodos() {
  await db.delete(todos);
}

const todoColumns = {
  id: todos.id,
  text: todos.text,
  done: todos.done,
};
