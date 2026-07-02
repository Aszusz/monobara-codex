import { createFileRoute, Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useState } from "react";
import { authClient } from "../../auth-client";

export const Route = createFileRoute("/_public/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      setError("Invalid credentials");
      return;
    }
    window.location.href = "/todos?filter=all";
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <form
        onSubmit={submit}
        className="mx-auto max-w-sm rounded-3xl bg-white/10 p-6 shadow-2xl ring-1 ring-white/10"
      >
        <h1 className="text-3xl font-bold tracking-tight">Log in</h1>
        <AuthFields
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
        />
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
        >
          Log in
        </button>
        <Link to="/signup" className="mt-4 block text-sm text-cyan-300">
          Need an account? Sign up
        </Link>
      </form>
    </main>
  );
}

export function AuthFields({
  email,
  password,
  setEmail,
  setPassword,
}: {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}) {
  return (
    <>
      <label className="mt-6 block text-sm font-medium" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
      />
      <label className="mt-4 block text-sm font-medium" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
      />
    </>
  );
}
