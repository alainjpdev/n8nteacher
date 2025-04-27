"use client";

import { useState } from "react";
import { signInWithEmail } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {   // 🔥 Aquí export default bien
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {errorMsg && (
          <p className="text-center text-sm text-red-500">{errorMsg}</p>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Sign In</Button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary underline">
            Create one
          </a>
        </p>
      </form>
    </div>
  );
}
