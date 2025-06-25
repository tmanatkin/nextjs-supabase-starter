"use client";

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
    </div>
  );
}
