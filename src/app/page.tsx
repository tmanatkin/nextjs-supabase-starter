"use client";

import Link from "next/link";
import { logout } from "./auth/actions";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  const handleLogout = async () => {
    const result = await logout();
    if (result?.success) {
      router.push("/auth/login");
    }
  };

  return (
    <div>
      <button className="button-link" onClick={handleLogout}>
        logout
      </button>
      <Link href="/auth/update-password">update password</Link>
    </div>
  );
}
