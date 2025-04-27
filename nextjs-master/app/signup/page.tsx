"use client";

import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth"; // ✅ BIEN
// 👈 función nueva (directa)
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password);
      router.push("/login"); // ✅ Los mandamos directo al login
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>

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
        <Button type="submit" className="w-full">Create Account</Button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
