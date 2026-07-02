import { createFileRoute, Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "../../auth-client";
import { AuthFields } from "./login";

export const Route = createFileRoute("/_public/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    <main className="min-h-screen px-4 py-10">
      <Card className="mx-auto max-w-sm rounded-3xl border-white/10 bg-card shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Sign up</CardTitle>
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
              Sign up
            </Button>
            <Link
              to="/login"
              className={buttonVariants({
                variant: "link",
                className: "mt-4 h-auto p-0 text-primary",
              })}
            >
              Already have an account? Log in
            </Link>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
