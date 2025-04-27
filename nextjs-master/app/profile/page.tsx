"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 👈 IMPORTANTE
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // 👈 INSTANCIA DEL ROUTER

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* User Info Card */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <Input value={user.email || ""} disabled />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">User ID</label>
                <Input value={user.id || ""} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Actions</h2>

            {/* Botón AI Power que redirecciona a /aipower */}
            <Button
              variant="default"
              className="w-full"
              onClick={() => router.push("/aipower")}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Power
            </Button>

            {/* Botón de Cerrar sesión */}
            <Button
              variant="destructive"
              className="w-full"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}