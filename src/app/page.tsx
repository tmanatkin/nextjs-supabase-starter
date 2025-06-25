"use client";

import { logout } from "./auth/actions";

export default function RootPage() {
  return (
    <div>
      <Link href="/auth/signup">Sign Up</Link>
      <br />
      <Link href="/auth/login">Login</Link>
    </div>
  );
}
