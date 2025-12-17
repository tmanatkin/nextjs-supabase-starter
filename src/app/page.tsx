"use client";

import Link from "next/link";
import { logout } from "./auth/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RootPage() {
  const router = useRouter();
  const handleLogout = async () => {
    const result = await logout();
    if (result?.success) {
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>You are logged in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Logout
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/update-password">Update Password</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
