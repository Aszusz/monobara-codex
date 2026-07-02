import { randomUUID } from "node:crypto";
import type { Todo } from "@monobara/contract";
import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { account, session, todos, user, verification } from "./schema";

export * as schema from "./schema";

const sql = postgres(
  process.env.DATABASE_URL ??
    "postgres://monobara:monobara@localhost:5432/monobara",
);
export const db = drizzle(sql);

export async function listTodos(userId: string): Promise<Todo[]> {
  return db
    .select(todoColumns)
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(desc(todos.createdAt));
}

export async function addTodo(userId: string, text: string): Promise<Todo[]> {
  await db.insert(todos).values({
    id: randomUUID(),
    userId,
    text,
  });

  return listTodos(userId);
}

export async function toggleTodo(userId: string, id: string): Promise<Todo[]> {
  const [todo] = await db
    .select({ done: todos.done })
    .from(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  if (todo) {
    await db
      .update(todos)
      .set({ done: !todo.done })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));
  }

  return listTodos(userId);
}

export async function deleteTodo(userId: string, id: string): Promise<Todo[]> {
  await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, userId)));
  return listTodos(userId);
}

export async function resetTodos() {
  await db.delete(todos);
  await db.delete(session);
  await db.delete(account);
  await db.delete(verification);
  await db.delete(user);
}

const todoColumns = {
  id: todos.id,
  text: todos.text,
  done: todos.done,
};
