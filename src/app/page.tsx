"use client";

import Link from "next/link";
import { logout } from "./auth/actions";

export default function RootPage() {
  const handleLogout = async () => {
    const result = await logout();
    if (result?.success) {
      window.location.href = "/";
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>logout</button>
      <Link href="/auth/update-password">update password</Link>
    </div>
  );
}
