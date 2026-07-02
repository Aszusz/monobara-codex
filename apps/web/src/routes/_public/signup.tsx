import { createFileRoute, Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { authClient } from "../../auth-client";
import { AuthFields } from "./login";

export const Route = createFileRoute("/_public/signup")({
  component: SignupPage,
});

function SignupPage() {
  const session = authClient.useSession();
  const navigate = Route.useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session.data) void navigate({ to: "/" });
  }, [navigate, session.data]);

  if (session.isPending) return null;
  if (session.data) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const result = await authClient.signUp.email({
      email,
      password,
      name: email,
    });
    if (result.error) {
      setError(result.error.message ?? "Could not sign up");
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
        <h1 className="text-3xl font-bold tracking-tight">Sign up</h1>
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
          Sign up
        </button>
        <Link to="/login" className="mt-4 block text-sm text-cyan-300">
          Already have an account? Log in
        </Link>
      </form>
    </main>
  );
}
