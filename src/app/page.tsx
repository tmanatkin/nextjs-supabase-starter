"use client";

import Link from "next/link";
import { logout } from "./auth/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export default function RootPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await logout();
    if (result?.success) {
      router.push("/auth/login");
    } else {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/risk-assessment">Take Risk Assessment</Link>
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleLogout} variant="outline" className="w-1/2" disabled={isLoggingOut}>
              {isLoggingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Logout"}
            </Button>
            <Button asChild variant="outline" className="w-1/2">
              <Link href="/auth/update-password">Update Password</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
