import { createFileRoute, Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <main className="min-h-screen px-4 py-10">
      <Card className="mx-auto max-w-sm rounded-3xl border-white/10 bg-card shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <AuthFields
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
            />
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="mt-6 w-full rounded-xl">
              Log in
            </Button>
            <Button
              asChild
              variant="link"
              className="mt-4 h-auto p-0 text-primary"
            >
              <Link to="/signup">Need an account? Sign up</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
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
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-2 h-12 rounded-xl bg-muted"
      />
      <Label className="mt-4" htmlFor="password">
        Password
      </Label>
      <Input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mt-2 h-12 rounded-xl bg-muted"
      />
    </>
  );
}
